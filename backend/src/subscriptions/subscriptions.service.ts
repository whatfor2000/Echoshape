import { Injectable } from '@nestjs/common';
import { OmiseService } from './omise.service';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly omise: OmiseService, private readonly prisma: PrismaService) {}

  private thbToSatang(amountThb: number) {
    return Math.round(amountThb * 100);
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