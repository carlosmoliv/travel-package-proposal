import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { ClientProxy } from '@nestjs/microservices';
import { IAM_SERVICE, TRAVEL_PACKAGE_SERVICE } from '@app/common/constants';

import { CreateProposalInput } from './inputs/create-proposal.input';
import { ProposalRepository } from './ports/proposal.repository';
import { ProposalFactory } from '../domain/factories/proposal.factory';

@Injectable()
export class ProposalService {
  constructor(
    private readonly proposalRepository: ProposalRepository,
    private readonly proposalFactory: ProposalFactory,
    @Inject(IAM_SERVICE)
    private readonly iamClient: ClientProxy,
    @Inject(TRAVEL_PACKAGE_SERVICE)
    private readonly travelPackageClient: ClientProxy,
  ) {}

  async create({
    travelPackageId,
    travelAgentId,
    clientId,
  }: CreateProposalInput): Promise<void> {
    const [clientExists, travelAgentExists, travelPackageExists] =
      await Promise.all([
        lastValueFrom(this.iamClient.send('user.checkIfExists', { clientId })),
        lastValueFrom(
          this.iamClient.send('user.checkIfExists', { travelAgentId }),
        ),
        lastValueFrom(
          this.travelPackageClient.send('travel-package.checkIfExists', {
            travelPackageId,
          }),
        ),
      ]);

    if (!clientExists) throw new NotFoundException('Client does not exist');
    if (!travelAgentExists)
      throw new NotFoundException('Travel agent does not exist');
    if (!travelPackageExists)
      throw new NotFoundException('Travel package does not exist');

    const proposal = this.proposalFactory.create(
      clientId,
      travelAgentId,
      travelPackageId,
    );

    await this.proposalRepository.save(proposal);
  }
}
