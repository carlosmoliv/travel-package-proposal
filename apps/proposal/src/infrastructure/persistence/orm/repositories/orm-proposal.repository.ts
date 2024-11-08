import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { ProposalRepository } from '../../../../application/ports/proposal.repository';
import { Proposal } from '../../../../domain/proposal';
import { ProposalEntity } from '../entities/proposal.entity';

@Injectable()
export class OrmProposalRepository implements ProposalRepository {
  constructor(
    @InjectRepository(ProposalEntity)
    private readonly proposalRepository: Repository<ProposalEntity>,
  ) {}

  async save(proposal: Proposal): Promise<void> {
    const proposalInstance = this.proposalRepository.create(proposal);
    await this.proposalRepository.save(proposalInstance);
  }

  async findById(id: string): Promise<Proposal> {
    return this.proposalRepository.findOne({ where: { id } });
  }
}
