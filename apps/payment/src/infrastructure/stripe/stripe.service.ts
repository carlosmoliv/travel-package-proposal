import Stripe from 'stripe';

import { Injectable } from '@nestjs/common';

import { PaymentGatewayService } from '../../application/ports/payment-gateway.service';

@Injectable()
export class StripeService implements PaymentGatewayService {
  private readonly client: Stripe;

  constructor() {
    this.client = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  async createCharge(amount: number): Promise<{ referenceId: string }> {
    const paymentIntent = await this.client.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      confirm: true,
      payment_method: 'pm_card_visa',
      return_url: 'https://test.com',
    });
    return { referenceId: paymentIntent.id };
  }
}
