import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class PaymentGatewayService {
  abstract createCharge(amount: number): Promise<{ referenceId: string }>;
}
