import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { NOTIFICATION_SERVICE } from '@app/common/constants';

import { PaymentGatewayService } from './ports/payment-gateway.service';
import { CreatePaymentInput } from './inputs/create-payment.input';
import { PaymentRepository } from './ports/payment-repository.service';
import { PaymentFactory } from '../domain/factories/payment.factory';
import { ConfirmPaymentInput } from './inputs/confirm-payment.input';
import { PaymentStatus } from '../domain/enums/payment-status.enum';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly paymentGateway: PaymentGatewayService,
    private readonly paymentRepository: PaymentRepository,
    private readonly paymentFactory: PaymentFactory,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationClient: ClientProxy,
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

  async confirmPayment({ paymentId }: ConfirmPaymentInput) {
    const payment = await this.paymentRepository.findOne(paymentId);
    if (!payment) throw new NotFoundException('Payment not found');

    payment.status = PaymentStatus.Paid;
    await this.paymentRepository.save(payment);

    this.notificationClient.emit('notify.email', {
      recipient: payment.customerEmail,
      subject: 'Payment Successful',
      message: 'Thank you for your payment!',
    });
  }
}
