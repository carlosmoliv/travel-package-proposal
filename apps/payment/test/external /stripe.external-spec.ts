import { StripeService } from '../../src/infrastructure/stripe/stripe.service';

describe('Stripe (external)', () => {
  let stripeService: StripeService;

  beforeAll(async () => {
    stripeService = new StripeService();
  });

  it('should create a charge successfully', async () => {
    const charge = await stripeService.createCharge(1000);
    console.log(charge);

    expect(charge).toBeDefined();
  });
});
