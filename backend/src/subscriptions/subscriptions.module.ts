import { Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { WebhookController } from '../webhook/webhook.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [SubscriptionsController, WebhookController],
  providers: [SubscriptionsService, PrismaService],
})
export class SubscriptionsModule {}