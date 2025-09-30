import { Injectable, BadRequestException } from '@nestjs/common';
import { OmiseService } from '../omise/omise.service';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly omise: OmiseService, private readonly prisma: PrismaService) {}
  
  private thbToSatang(amountThb: number) {
    return Math.round(amountThb * 100);
  }

  async getUserSubscription(userId: string) {
    if (!userId) {
      throw new Error('userId is required'); // หรือ BadRequestException
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        subscriptionStatus: true,
        planId: true,
        nextBillingAt: true,
        usedThisMonth: true, // ต้องมี field ใน Prisma schema
        maxGenerate: true,  // ต้องมี field ใน Prisma schema
      },
    });

    if (!user) throw new Error('User not found');
    return user;
  }

    // เรียกเมื่อ user generate ภาพ
  async generateImage(userId: string, imageUrl: string, amount: number) {
    // ดึงข้อมูล user
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');

    // กำหนด limit
    const maxImages = user.subscriptionStatus === 'active' ? 50 : 2;

    // เช็ค limit
    if (user.usedThisMonth >= maxImages) {
      throw new BadRequestException(`คุณใช้จำนวนภาพครบ limit แล้ว (${maxImages} ภาพต่อเดือน)`);
    }

    // สร้าง Charge ใน DB
    await this.prisma.charge.create({
      data: {
        amount,
        currency: 'THB',
        promptpayUrl: imageUrl,
        status: 'generated',
      },
    });

    // อัปเดต user usedThisMonth
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        usedThisMonth: user.usedThisMonth + 1,
      },
    });

    return {
      message: 'Image generated successfully',
      usedThisMonth: user.usedThisMonth + 1,
      maxImages,
    };
  }

  async createSubscription(userId: string, planId: string, amountThb: number, cardToken: string) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error('user not found');

      let customerId = user.omiseCustomerId ?? undefined;
      let cardId: string | undefined;

      if (!customerId) {
        const { customer, cardId: createdCardId } = await this.omise.createCustomerWithCard(user.email, user.id, cardToken);
        customerId = customer.id;
        cardId = createdCardId;
      } else {
        const cardResp = await this.omise.createCardForCustomer(customerId, cardToken);
        cardId = cardResp.id;
      }

      if (!cardId) throw new Error('card id missing after create');

      const schedule = await this.omise.createSchedule(customerId, cardId, this.thbToSatang(amountThb), planId);

      const updated = await tx.user.update({
        where: { id: userId },
        data: {
          omiseCustomerId: customerId,
          omiseCardId: cardId,
          omiseScheduleId: schedule.id,
          subscriptionStatus: 'active',
          planId
        }
      });

      return updated;
    });
  }

  async cancelSubscription(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.omiseScheduleId) throw new Error('No active subscription');

    // ลบ schedule บน Omise
    await this.omise.deleteSchedule(user.omiseScheduleId);

    // อัปเดตสถานะใน DB
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        omiseScheduleId: null,
        subscriptionStatus: 'canceled',
      },
    });
  }
}