import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()

export class LikesService {
  constructor(private prisma: PrismaService) {}

  async toggleLike(userId: string, imageId: string) {
    const existing = await this.prisma.like.findUnique({
      where: {
        userId_imageId: { // ต้องตรงกับชื่อ @@unique([userId, imageId]) ใน schema
            userId: userId,   // ✅ ตัวแปรจริง ไม่ใช่ String literal
            imageId: imageId, // ✅ ตัวแปรจริง
        },
      },
    });

    if (existing) {
      await this.prisma.like.delete({ where: { id: existing.id } });
      return { liked: false };
    } else {
      await this.prisma.like.create({ data: { userId, imageId } });
      return { liked: true };
    }
  }
}
