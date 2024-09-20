import { randomUUID } from 'crypto';

import { Injectable } from '@nestjs/common';

import { Proposal } from '../proposal';
import { ProposalStatus } from '../enums/proposal-status';

@Injectable()
export class ProposalFactory {
  create(
    clientId: string,
    travelAgentId: string,
    travelPackageId: string,
    status: ProposalStatus = ProposalStatus.Pending,
  ): Proposal {
    const id = randomUUID();
    return new Proposal(id, clientId, travelAgentId, travelPackageId, status);
  }
}
