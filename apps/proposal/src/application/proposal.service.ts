import { Injectable } from '@nestjs/common';

import { CreateProposalInput } from './inputs/create-proposal.input';
import { ProposalRepository } from './ports/proposal.repository';
import { ProposalFactory } from '../domain/factories/proposal.factory';

@Injectable()
export class ProposalService {
  constructor(
    private readonly proposalRepository: ProposalRepository,
    private readonly proposalFactory: ProposalFactory,
  ) {}

  async create(createProposalInput: CreateProposalInput): Promise<void> {
    const proposal = this.proposalFactory.create(
      createProposalInput.clientId,
      createProposalInput.travelAgentId,
      createProposalInput.travelPackageId,
    );
    await this.proposalRepository.save(proposal);
  }
}
