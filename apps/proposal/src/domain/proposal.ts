import { ProposalStatus } from './enums/proposal-status';

export class Proposal {
  constructor(
    public id: string,
    public clientId: string,
    public travelAgentId: string,
    public travelPackageId: string,
    public status: ProposalStatus,
    public price: number,
    public paymentId?: string,
  ) {}
}
