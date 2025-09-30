import { Controller, Post, Body } from '@nestjs/common';
import { OmiseService } from './omise.service';

@Controller('omise')
export class OmiseController {
  constructor(private readonly omiseService: OmiseService) {}

    @Post('promptpay')
    async createPromptPay(@Body('amount') amount: number) {
    const charge = await this.omiseService.createPromptPayCharge(amount);
    return charge
    }
}
