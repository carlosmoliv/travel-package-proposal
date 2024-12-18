import Stripe from 'stripe';

import { Injectable, Logger } from '@nestjs/common';

import { PaymentGatewayService } from '../../application/ports/payment-gateway.service';
import { StripeWebhookHandler } from './stripe-webhook';

@Injectable()
export class StripeService
  implements PaymentGatewayService, StripeWebhookHandler
{
  private readonly client: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor() {
    this.client = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  verifyWebhookSignature(payload: string | Buffer, signature: string) {
    return this.client.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  }

  async createCheckout(amount: number, entityId: string): Promise<string> {
    const session = await this.client.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      currency: 'USD',
      line_items: [
        {
          price_data: {
            currency: 'USD',
            unit_amount: Math.floor(amount * 100),
            product_data: {
              name: 'Example',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        entityId: entityId,
      },
      success_url: 'https://localhost:3001/payments/checkout',
      cancel_url: 'https://localhost:3001/payments/cancel',
    });
    return session.url;
  }

  async processSuccess(data: any) {
    this.logger.log(`Processing, event metadata: ${data.metadata}`);
  }
}
