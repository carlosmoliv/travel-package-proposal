import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { ProposalRepository } from '../../../../application/ports/proposal.repository';
import { Proposal } from '../../../../domain/proposal';
import { OrmProposal } from '../entities/orm-proposal.entity';

@Injectable()
export class OrmProposalRepository implements ProposalRepository {
  constructor(
    @InjectRepository(OrmProposal)
    private readonly proposalRepository: Repository<OrmProposal>,
  ) {}

  async save(proposal: Proposal): Promise<void> {
    const proposalInstance = this.proposalRepository.create(proposal);
    await this.proposalRepository.save(proposalInstance);
  }
}
