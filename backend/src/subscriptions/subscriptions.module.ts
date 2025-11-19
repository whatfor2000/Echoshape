import { Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { WebhookController } from '../webhook/webhook.controller';
import { PrismaService } from '../prisma.service';
import { OmiseModule } from '../omise/omise.module';

@Module({
  imports: [OmiseModule],
  controllers: [SubscriptionsController, WebhookController],
  providers: [SubscriptionsService, PrismaService],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}