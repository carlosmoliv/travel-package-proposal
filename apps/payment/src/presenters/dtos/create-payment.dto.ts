import { IsDecimal, IsEmail } from 'class-validator';

export class CreatePaymentDto {
  @IsDecimal()
  amount: number;

  @IsEmail()
  customerEmail: string;
}
