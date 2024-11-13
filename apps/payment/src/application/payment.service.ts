import { BadRequestException, Injectable } from '@nestjs/common';

import { PaymentGatewayService } from './ports/payment-gateway.service';
import { CreatePaymentInput } from './inputs/create-payment.input';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentGateway: PaymentGatewayService) {}

  async create(input: CreatePaymentInput) {
    throw new BadRequestException();
    // try {
    //   const chargeResult = await this.paymentGateway.createCharge(input.amount);
    //
    //   return { referenceId: chargeResult.referenceId };
    // } catch (error) {
    //   throw new BadRequestException('Payment failed');
    // }
  }
}
