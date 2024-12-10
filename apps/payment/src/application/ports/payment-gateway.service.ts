import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class PaymentGatewayService {
  abstract createCheckout(amount: number): Promise<string>;
}
