import { Module } from '@nestjs/common';

import { StripeWebhookController } from '../../presenters/controllers/payment-webhook.controller';
import { StripeClientProvider } from './stripe-client.provider';
import { StripeWebhookService } from './stripe-webhook.service';

@Module({
  providers: [StripeClientProvider, StripeWebhookService],
  controllers: [StripeWebhookController],
})
export class StripeModule {}
