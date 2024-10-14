import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { TravelPackagePermission } from '@app/common/iam/enums/travel-package.permissions.enum';
import { Permissions } from '@app/common/iam/decorators/permissions.decorator';

import { CreateProposalDto } from '../dtos/create-proposal.dto';
import { ProposalService } from '../../application/proposal.service';

@Controller('proposals')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Permissions(TravelPackagePermission.CreateTravelPackage)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createProposalDto: CreateProposalDto) {
    await this.proposalService.create(createProposalDto);
  }
}
