import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { PaymentGatewayService } from './ports/payment-gateway.service';
import { CreatePaymentInput } from './inputs/create-payment.input';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(private readonly paymentGateway: PaymentGatewayService) {}

  async create(input: CreatePaymentInput) {
    try {
      const chargeResult = await this.paymentGateway.createCharge(input.amount);
      return { referenceId: chargeResult.referenceId };
    } catch (error) {
      this.logger.error(
        `Failed to create payment. Input: ${JSON.stringify(input)}`,
        error.stack,
      );
      throw new InternalServerErrorException('Payment failed');
    }
  }
}
