import Stripe from 'stripe';

import { Inject, Injectable } from '@nestjs/common';

import { PaymentGatewayService } from '../../application/ports/payment-gateway.service';

@Injectable()
export class StripeService implements PaymentGatewayService {
  constructor(@Inject('STRIPE_CLIENT') private readonly client: Stripe) {}

  async createCheckout(amount: number, referenceId: string): Promise<string> {
    const session = await this.client.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
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
      client_reference_id: referenceId,
      success_url: process.env.STRIPE_CHECKOUT_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CHECKOUT_CANCEL_URL,
    });
    return session.url;
  }
}
