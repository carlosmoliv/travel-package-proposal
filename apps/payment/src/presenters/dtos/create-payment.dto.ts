import { IsDecimal, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsDecimal()
  amount: number;

  @IsString()
  entityId: string;
}
