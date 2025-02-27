import { IsDecimal, IsString } from 'class-validator';

export class CreateProposalDto {
  @IsString()
  clientId: string;

  @IsString()
  travelAgentId: string;

  @IsString()
  travelPackageId: string;

  @IsDecimal()
  price: number;
}
