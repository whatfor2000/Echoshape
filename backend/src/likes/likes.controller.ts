import { Controller, Post, Body } from '@nestjs/common';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('toggle')
  async toggleLike(@Body() body: { userId: string; imageId: string }) {
    return this.likesService.toggleLike(body.userId, body.imageId);
  }
}
