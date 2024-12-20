import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';

import { Permissions } from '@app/common/iam/decorators/permissions.decorator';

import { CreateProposalDto } from '../dtos/create-proposal.dto';
import { ProposalService } from '../../application/proposal.service';
import { ProposalPermission } from '@app/common/iam/enums/proposal.permissions.enum';

@Controller('proposals')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Permissions(ProposalPermission.CreateProposal)
  @Post()
  async create(@Body() createProposalDto: CreateProposalDto) {
    await this.proposalService.create(createProposalDto);
  }

  @Permissions(ProposalPermission.AcceptProposal)
  @HttpCode(HttpStatus.OK)
  @Post(':proposalId/accept')
  async acceptProposal(@Param('proposalId') proposalId: string): Promise<void> {
    await this.proposalService.acceptProposal(proposalId);
  }

  @Permissions(ProposalPermission.PayProposal)
  @HttpCode(HttpStatus.OK)
  @Post(':proposalId/pay')
  async payProposal(
    @Param('proposalId') proposalId: string,
  ): Promise<{ checkoutUrl: string }> {
    return this.proposalService.payProposal(proposalId);
  }
}
