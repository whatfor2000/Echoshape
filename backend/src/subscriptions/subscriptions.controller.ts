import { Body, Controller, Post, Req,Get,UseGuards,UnauthorizedException  } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly svc: SubscriptionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('subscribe')
  async subscribe(
    @Req() req: any, 
    @Body() dto: { planId: string; amount: number; token: string } // <--- ต้องตรงกับ frontend
  ) {
    const userId = req.user?.Id; // ตรวจสอบว่า jwt guard ใส่ userId ลง req.user
    if (!userId) throw new UnauthorizedException('User not authenticated');

    // map dto fields ให้ตรง service
    const amountThb = dto.amount;
    const cardToken = dto.token;

    return this.svc.createSubscription(userId, dto.planId, amountThb, cardToken);
  }



  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMySubscription(@Req() req: any) {
    const userId = req.user?.Id;
    if (!userId) throw new UnauthorizedException();
    return this.svc.getUserSubscription(userId);
  }
  


  @Post('generate-image')
  async generateImage(@Req() req: any, @Body() body: { imageUrl: string; amount: number }) {
    const userId = req.user?.Id; // จาก OAuth / AuthGuard
    return this.svc.generateImage(userId, body.imageUrl, body.amount);
  }
}
