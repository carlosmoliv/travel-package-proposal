import { Module } from '@nestjs/common';

import { PaymentController } from './presenters/controllers/payment.controller';
import { PaymentService } from './application/payment.service';
import { PaymentGatewayService } from './application/ports/payment-gateway.service';
import { StripeService } from './infrastructure/stripe/stripe.service';

@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    {
      provide: PaymentGatewayService,
      useClass: StripeService,
    },
  ],
})
export class PaymentModule {}
