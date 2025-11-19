import { Controller, Get, Delete, UseGuards, Query } from '@nestjs/common';
import { ImagesService } from './images.service';
import { Param, Req } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { NextImageDto } from './dto/next-image.dto';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}
  private prisma: PrismaService = new PrismaService();

  @Get()
  async getAllImages() {
    return this.imagesService.getAllImages();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async myImages(@Req() req) {
    const userId = req.user.id;
    return this.imagesService.getUserImages(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteImage(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    return this.imagesService.deleteImage(id, userId);
  }

  @Get('next')
  async getNextImage(@Query() query: NextImageDto) {
    const image = await this.imagesService.getNextImage(query.afterId);
    if (!image) {
      return { message: 'No more images', data: null };
    }

    // return แบบ frontend ใช้งานง่าย
    return {
      id: image.id,
      title: image.title,
      src: image.src,
      likes: image.likes.map((l) => ({ userId: l.userId })),
    };
  }
}
