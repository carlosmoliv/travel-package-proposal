import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { PaymentService } from '../../application/payment.service';
import { CreatePaymentDto } from '../dtos/create-payment.dto';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern('payment.create')
  async create(@Payload() data: CreatePaymentDto) {
    return this.paymentService.create(data);
  }
}
