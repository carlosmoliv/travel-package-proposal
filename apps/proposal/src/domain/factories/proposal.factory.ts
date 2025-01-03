import { randomUUID } from 'crypto';

import { Injectable } from '@nestjs/common';

import { Proposal } from '../proposal';

@Injectable()
export class ProposalFactory {
  create({
    id,
    clientId,
    travelPackageId,
    travelAgentId,
    status,
    price,
  }: Partial<Proposal>): Proposal {
    const proposalId = id ?? randomUUID();
    return new Proposal(
      proposalId,
      clientId,
      travelAgentId,
      travelPackageId,
      status,
      price,
    );
  }
}
