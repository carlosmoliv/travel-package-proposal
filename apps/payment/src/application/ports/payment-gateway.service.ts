import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class PaymentGatewayService {
  abstract createCheckout(amount: number, referenceId: string): Promise<string>;
}
