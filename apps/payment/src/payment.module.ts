import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { LoggingInterceptor } from '@app/common/logger/logging.interceptor';

import { PaymentController } from './presenters/controllers/payment.controller';
import { PaymentService } from './application/payment.service';
import { PaymentGatewayService } from './application/ports/payment-gateway.service';
import { StripeService } from './infrastructure/stripe/stripe.service';
import { StripeModule } from './infrastructure/stripe/stripe.module';

@Module({
  imports: [StripeModule],
  providers: [
    PaymentService,
    {
      provide: PaymentGatewayService,
      useClass: StripeService,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  controllers: [PaymentController],
})
export class PaymentModule {}
