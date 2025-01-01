import * as Joi from 'joi';

import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { NOTIFICATION_SERVICE } from '@app/common/constants';
import { LoggingInterceptor } from '@app/common/logger/logging.interceptor';

import { PaymentController } from './presenters/controllers/payment.controller';
import { PaymentService } from './application/payment.service';
import { PaymentGatewayService } from './application/ports/payment-gateway.service';
import { StripeService } from './infrastructure/stripe/stripe.service';
import { PaymentRepository } from './application/ports/payment-repository.service';
import { OrmPaymentRepository } from './infrastructure/persistence/orm/repositories/orm-payment.repository';
import { StripeWebhookController } from './presenters/controllers/payment-webhook.controller';
import { StripeClientProvider } from './infrastructure/stripe/stripe-client.provider';
import { StripeWebhookService } from './infrastructure/stripe/stripe-webhook.service';
import { typeOrmAsyncConfig } from './config/orm.config';
import { PaymentEntity } from './infrastructure/persistence/orm/entities/payment.entity';
import { PaymentFactory } from './domain/factories/payment.factory';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        STRIPE_SECRET_KEY: Joi.string().required(),
        STRIPE_WEBHOOK_SECRET: Joi.string().required(),
        STRIPE_CHECKOUT_SUCCESS_URL: Joi.string().required(),
        RABBITMQ_URI: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    TypeOrmModule.forFeature([PaymentEntity]),
    ClientsModule.registerAsync([
      {
        name: NOTIFICATION_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
            queue: 'notification_queue',
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [
    PaymentService,
    StripeClientProvider,
    StripeWebhookService,
    {
      provide: PaymentGatewayService,
      useClass: StripeService,
    },
    {
      provide: PaymentRepository,
      useClass: OrmPaymentRepository,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    PaymentFactory,
  ],
  controllers: [PaymentController, StripeWebhookController],
})
export class PaymentModule {}
