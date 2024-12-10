import Stripe from 'stripe';

import { Injectable } from '@nestjs/common';

import { PaymentGatewayService } from '../../application/ports/payment-gateway.service';

@Injectable()
export class StripeService implements PaymentGatewayService {
  private readonly client: Stripe;

  constructor() {
    this.client = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  async createCheckout(amount: number): Promise<string> {
    const session = await this.client.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      currency: 'USD',
      line_items: [
        {
          price_data: {
            currency: 'USD',
            unit_amount: this.convertAmount(amount),
          },
          quantity: 1,
        },
      ],
    });
    return session.url;
  }

  private convertAmount(rawAmount: number) {
    return Math.floor(rawAmount * 100);
  }
}
