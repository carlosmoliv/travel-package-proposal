import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { ClientProxy } from '@nestjs/microservices';
import {
  IAM_SERVICE,
  PAYMENT_SERVICE,
  TRAVEL_PACKAGE_SERVICE,
} from '@app/common/constants';

import { CreateProposalInput } from './inputs/create-proposal.input';
import { ProposalRepository } from './ports/proposal.repository';
import { ProposalFactory } from '../domain/factories/proposal.factory';
import { ProposalStatus } from '../domain/enums/proposal-status';
import { Proposal } from '../domain/proposal';

@Injectable()
export class ProposalService {
  private readonly MOCK_EMAIL = 'freetier158@gmail.com';
  private readonly logger = new Logger(ProposalService.name);

  constructor(
    private readonly proposalRepository: ProposalRepository,
    private readonly proposalFactory: ProposalFactory,
    @Inject(IAM_SERVICE)
    private readonly iamClient: ClientProxy,
    @Inject(TRAVEL_PACKAGE_SERVICE)
    private readonly travelPackageClient: ClientProxy,
    @Inject(PAYMENT_SERVICE) private readonly paymentClient: ClientProxy,
  ) {}

  async create(input: CreateProposalInput): Promise<void> {
    const { clientId, travelAgentId, travelPackageId, price } = input;

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

    const proposal = this.proposalFactory.create({
      travelPackageId,
      travelAgentId,
      clientId,
      status: ProposalStatus.Pending,
      price,
    });

    await this.proposalRepository.save(proposal);
  }

  async acceptProposal(proposalId: string): Promise<void> {
    const proposal = await this.findById(proposalId);
    if (proposal.status !== ProposalStatus.Pending) {
      throw new UnprocessableEntityException(
        'You cannot accept a proposal already accepted or rejected',
      );
    }
    proposal.status = ProposalStatus.Accepted;
    await this.proposalRepository.save(proposal);
  }

  async payProposal(proposalId: string): Promise<{ checkoutUrl: string }> {
    const proposal = await this.findById(proposalId);
    if (proposal.status !== ProposalStatus.Accepted) {
      throw new UnprocessableEntityException(
        `Cannot proceed with payment. Proposal status is '${proposal.status}'.`,
      );
    }
    try {
      const checkoutUrl = await lastValueFrom(
        this.paymentClient.send('payment.create', {
          amount: proposal.price,
          referenceId: proposalId,
          // TODO: replace mocked email with correct dynamic logic
          customerEmail: this.MOCK_EMAIL,
        }),
      );
      return { checkoutUrl };
    } catch (error) {
      this.logger.error(
        `Failed to process payment for proposal ${proposalId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to create payment session for the proposal',
      );
    }
  }

  private async findById(id: string): Promise<Proposal> {
    const proposal = await this.proposalRepository.findById(id);
    if (!proposal) throw new NotFoundException('Proposal not found');
    return proposal;
  }
}
