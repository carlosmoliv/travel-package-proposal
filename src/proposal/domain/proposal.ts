import { ProposalStatus } from './enums/proposal-status';
import { TravelPackage } from '../../travel-package/domain/travel-package';

export class Proposal {
  constructor(
    public id: number,
    public userId: number,
    public clientId: number,
    public travelPackages: TravelPackage[],
    public message: string,
    public status: ProposalStatus,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
