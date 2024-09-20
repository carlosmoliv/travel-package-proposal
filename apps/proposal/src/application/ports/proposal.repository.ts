import { Injectable } from '@nestjs/common';
import { Proposal } from '../../domain/proposal';

@Injectable()
export abstract class ProposalRepository {
  abstract save(proposal: Proposal): Promise<void>;
}
