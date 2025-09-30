// subscriptions.controller.ts
import { Body, Controller, Post, Req } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly svc: SubscriptionsService) {}

  @Post('subscribe')
  async subscribe(@Req() req: any, @Body() dto: { planId: string; amountThb: number; cardToken: string }) {
    const user = req.user; // จาก Facebook OAuth
    return this.svc.createSubscription(user.id, dto.planId, dto.amountThb, dto.cardToken);
  }
  
  @Post('generate-image')
  async generateImage(@Req() req: any, @Body() body: { imageUrl: string; amount: number }) {
    const userId = req.user.id; // จาก OAuth / AuthGuard
    return this.svc.generateImage(userId, body.imageUrl, body.amount);
  }
}
