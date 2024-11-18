import { IsDecimal } from 'class-validator';

export class CreatePaymentDto {
  @IsDecimal()
  amount: number;
}
