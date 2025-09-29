import { IsString, IsNumber } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  planId: string;

  @IsNumber()
  amountThb: number; // เช่น 299.00

  @IsString()
  cardToken: string; // Omise card token from omise.js
}