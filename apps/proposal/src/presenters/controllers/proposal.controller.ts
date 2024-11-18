import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';

import { TravelPackagePermission } from '@app/common/iam/enums/travel-package.permissions.enum';
import { Permissions } from '@app/common/iam/decorators/permissions.decorator';

import { CreateProposalDto } from '../dtos/create-proposal.dto';
import { ProposalService } from '../../application/proposal.service';

@Controller('proposals')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Permissions(TravelPackagePermission.CreateTravelPackage)
  @Post()
  async create(@Body() createProposalDto: CreateProposalDto) {
    await this.proposalService.create(createProposalDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post(':proposalId/accept')
  async acceptProposal(@Param('proposalId') proposalId: string): Promise<void> {
    await this.proposalService.acceptProposal(proposalId);
  }

  @HttpCode(HttpStatus.OK)
  @Post(':proposalId/pay')
  async payProposal(@Param('payment') proposalId: string): Promise<void> {
    await this.proposalService.payProposal(proposalId);
  }
}
