import Stripe from 'stripe';

import { StripeService } from './stripe.service';

jest.mock('stripe');

describe('StripeService', () => {
  let sut: StripeService;
  let stripeMock: jest.Mocked<typeof Stripe>;

  beforeAll(async () => {
    stripeMock = Stripe as jest.Mocked<typeof Stripe>;
  });

  beforeEach(() => {
    sut = new StripeService();
  });

  it('should initialize the Stripe client with the secret key', () => {
    expect(Stripe).toHaveBeenCalledWith(process.env.STRIPE_SECRET_KEY);
  });
});
