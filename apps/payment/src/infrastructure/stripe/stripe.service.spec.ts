import Stripe from 'stripe';

describe('StripeService', () => {
  it('should initialize the Stripe client with the secret key', () => {
    expect(Stripe).toHaveBeenCalledWith(process.env.STRIPE_SECRET_KEY);
  });

  describe('createCharge', () => {
    it.todo('should create a payment intent and return the reference ID');
  });
});
