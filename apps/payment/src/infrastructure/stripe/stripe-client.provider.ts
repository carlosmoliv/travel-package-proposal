import Stripe from 'stripe';

import { Provider } from '@nestjs/common';

export const StripeClientProvider: Provider = {
  provide: 'STRIPE_CLIENT',
  useFactory: () => new Stripe(process.env.STRIPE_SECRET_KEY),
};
