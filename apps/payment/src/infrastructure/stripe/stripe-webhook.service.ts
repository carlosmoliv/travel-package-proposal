import Stripe from 'stripe';

import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';

import { PaymentService } from '../../application/payment.service';
import { ConfirmPaymentInput } from '../../application/inputs/confirm-payment.input';

@Injectable()
export class StripeWebhookService {
  private readonly logger = new Logger(StripeWebhookService.name);

  constructor(
    @Inject('STRIPE_CLIENT') private readonly client: Stripe,
    private readonly paymentService: PaymentService,
  ) {}

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
        await this.processSuccess(event.data.object);
        break;
      default:
        this.logger.warn(`Unhandled event type: ${event.type}`);
    }
  }

  private async processSuccess(session: Stripe.Checkout.Session) {
    this.logger.log('the payment was successfully processed.');
    await this.paymentService.confirmPayment(
      session.metadata as unknown as ConfirmPaymentInput,
    );
  }
}
