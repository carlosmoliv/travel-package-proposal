import { Injectable } from '@nestjs/common';

import { Payment } from '../../domain/payment';

@Injectable()
export abstract class PaymentRepository {
  abstract save(payment: Payment): Promise<void>;
  abstract findOne(id: string): Promise<Payment>;
}
