import Stripe from 'stripe';

import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';

@Injectable()
export class StripeWebhookService {
  private readonly logger = new Logger(StripeWebhookService.name);

  constructor(@Inject('STRIPE_CLIENT') private readonly client: Stripe) {}

  async handleWebhook(signature: string, payload: string | Buffer) {
    try {
      const event = this.verifyWebhookSignature(signature, payload);
      await this.processEvent(event);
    } catch (error) {
      this.logger.error(`Webhook error: ${error.message}`);
      throw new BadRequestException('Stripe webhook verification failed');
    }
  }

  private verifyWebhookSignature(signature: string, payload: string | Buffer) {
    return this.client.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  }

  private async processEvent(event: Stripe.Event) {
    switch (event.type) {
      case 'checkout.session.completed':
        this.processSuccess(event.data.object);
        break;
      default:
        this.logger.warn(`Unhandled event type: ${event.type}`);
    }
  }

  private processSuccess(data: any) {
    this.logger.log(`Processing, event metadata: ${data.metadata}`);
    // TODO: implement business logic
  }
}
