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
            unit_amount: Math.floor(amount * 100),
            product_data: {
              name: 'Example',
            },
          },
          quantity: 1,
        },
      ],
      success_url: 'https://localhost:3001/payments/checkout',
      cancel_url: 'https://localhost:3001/payments/cancel',
    });
    return session.url;
  }
}
