import { Module } from '@nestjs/common';
import { ProposalController } from './proposal.controller';
import { ProposalService } from './application/proposal.service';

@Module({
  imports: [],
  controllers: [ProposalController],
  providers: [ProposalService],
})
export class ProposalModule {}
