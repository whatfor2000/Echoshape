import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ImagesService {
  constructor(private prisma: PrismaService) {}

  async getAllImages() {
    return this.prisma.image.findMany({
      include: { likes: true },
    });
  }
}
