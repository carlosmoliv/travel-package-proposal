import { PaymentStatus } from './enums/payment-status.enum';

export class Payment {
  constructor(
    public id: string,
    public amount: number,
    public customerEmail: string,
    public status: PaymentStatus = PaymentStatus.Unpaid,
  ) {}
}
