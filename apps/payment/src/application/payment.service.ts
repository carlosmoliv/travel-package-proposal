import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { NOTIFICATION_SERVICE } from '@app/common/constants';

import { PaymentGatewayService } from './ports/payment-gateway.service';
import { CreatePaymentInput } from './inputs/create-payment.input';
import { PaymentRepository } from './ports/payment-repository.service';
import { PaymentFactory } from '../domain/factories/payment.factory';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly paymentGateway: PaymentGatewayService,
    @Inject(NOTIFICATION_SERVICE)
    private readonly paymentRepository: PaymentRepository,
    private readonly paymentFactory: PaymentFactory,
  ) {}

  async create(input: CreatePaymentInput) {
    try {
      const payment = this.paymentFactory.create({
        amount: input.amount,
        customerEmail: input.customerEmail,
      });
      await this.paymentRepository.save(payment);
      return await this.paymentGateway.createCheckout(input.amount, payment.id);
    } catch (error) {
      this.logger.error(
        `Failed to create payment. Input: ${JSON.stringify(input)}`,
        error.stack,
      );
      throw new InternalServerErrorException('Payment failed');
    }
  }
}
