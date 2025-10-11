import { Injectable, UnauthorizedException, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ImagesService {
  constructor(private prisma: PrismaService) {}

  async getAllImages() {
    return this.prisma.image.findMany({
      include: { likes: true },
    });
  }

  async generateImage(userId: string, imageUrl: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();

    const maxGenerate = user.planId === 'subscription' ? 50 : 2;
    if (user.usedThisMonth >= maxGenerate) {
      throw new BadRequestException(`You have reached monthly limit of ${maxGenerate} images`);
    }

    const image = await this.prisma.image.create({
      data: { userId, src: imageUrl, title: `Generated Image ${new Date().toLocaleDateString()}` },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { usedThisMonth: { increment: 1 } },
    });

    return { ...image, usedThisMonth: user.usedThisMonth + 1 };
  }
  
  async getUserImages(userId: string) {
    return this.prisma.image.findMany({
      where: { userId },
      include: { likes: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteImage(imageId: string, userId: string) {
    const image = await this.prisma.image.findUnique({ where: { id: imageId } });
    if (!image) throw new NotFoundException('Image not found');
    if (image.userId !== userId) throw new ForbiddenException('You cannot delete this image');
    return this.prisma.image.delete({ where: { id: imageId } });
  }

  
  async getNextImage(afterId?: string) {
    // ถ้ามี afterId ให้ดึงภาพที่ id > afterId (Assuming id is cuid & sortable)
    const image = await this.prisma.image.findFirst({
      where: afterId ? { id: { gt: afterId } } : {},
      orderBy: { createdAt: 'asc' },
      take: 1,
      include: { likes: true }, // รวมจำนวนไลก์
    });

    return image; // ถ้าไม่มี return null
  }

}
