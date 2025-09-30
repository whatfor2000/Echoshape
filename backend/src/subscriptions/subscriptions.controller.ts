import { Body, Controller, Post, Req,Get,UseGuards,UnauthorizedException  } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly svc: SubscriptionsService) {}

  @Post('subscribe')
  async subscribe(@Req() req: any, @Body() dto: { planId: string; amountThb: number; cardToken: string }) {
    const user = req.user?.Id; // จาก Facebook OAuth
    return this.svc.createSubscription(user.id, dto.planId, dto.amountThb, dto.cardToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMySubscription(@Req() req: any) {
    const userId = req.user?.Id;
    console.log('User ID from JWT:', userId);
    if (!userId) throw new UnauthorizedException();
    return this.svc.getUserSubscription(userId);
  }
  


  @Post('generate-image')
  async generateImage(@Req() req: any, @Body() body: { imageUrl: string; amount: number }) {
    const userId = req.user?.Id; // จาก OAuth / AuthGuard
    return this.svc.generateImage(userId, body.imageUrl, body.amount);
  }
}
