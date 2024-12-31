import { randomUUID } from 'crypto';

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
import { Payment } from '../domain/payment';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly paymentGateway: PaymentGatewayService,
    @Inject(NOTIFICATION_SERVICE)
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async create(input: CreatePaymentInput) {
    try {
      // TODO: move the id generation to the domain layer using a factory
      const paymentId = randomUUID();
      const payment = new Payment(paymentId, input.amount, input.customerEmail);
      await this.paymentRepository.save(payment);
      return await this.paymentGateway.createCheckout(input.amount, paymentId);
    } catch (error) {
      this.logger.error(
        `Failed to create payment. Input: ${JSON.stringify(input)}`,
        error.stack,
      );
      throw new InternalServerErrorException('Payment failed');
    }
  }
}
