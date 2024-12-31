import { Injectable } from '@nestjs/common';

import { randomUUID } from 'crypto';
import { Payment } from '../payment';

@Injectable()
export class PaymentFactory {
  create({ id, amount, status, customerEmail }: Partial<Payment>): Payment {
    const paymentId = id ?? randomUUID();
    return new Payment(paymentId, amount, customerEmail, status);
  }
}
