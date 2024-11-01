import { Currency } from './currency';
import { PaymentStatus } from './enums/payment-status.enum';

export class Payment {
  constructor(
    public id: string,
    public amount: number,
    public proposalId: string,
    public currency: Currency,
    public status: PaymentStatus,
    public transactionId?: string,
  ) {}
}
