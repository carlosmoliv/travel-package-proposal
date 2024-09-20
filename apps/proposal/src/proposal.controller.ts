import { Controller, Get } from '@nestjs/common';
import { ProposalService } from './proposal.service';

@Controller()
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Get()
  getHello(): string {
    return this.proposalService.getHello();
  }
}
