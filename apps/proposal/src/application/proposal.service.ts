import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { catchError, lastValueFrom, tap } from 'rxjs';

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

    const proposal = this.proposalFactory.create({
      travelPackageId,
      travelAgentId,
      clientId,
      status: ProposalStatus.Pending,
      price: 10,
    });

    await this.proposalRepository.save(proposal);
  }

  async acceptProposal(proposalId: string): Promise<void> {
    const proposal = await this.findById(proposalId);
    proposal.status = ProposalStatus.Accepted;
    await this.proposalRepository.save(proposal);
  }

  async payProposal(proposalId: string) {
    const proposal = await this.findById(proposalId);

    if (proposal.status !== ProposalStatus.Accepted) {
      throw new UnprocessableEntityException(
        'Proposal must be accepted before payment',
      );
    }

    this.paymentClient.send('payment.create', { amount: proposal.price }).pipe(
      tap(async (paymentId) => {
        proposal.status = ProposalStatus.Paid;
        proposal.paymentId = paymentId;
        await this.proposalRepository.save(proposal);
      }),
      catchError((error) => {
        this.logger.error(error);
        throw new InternalServerErrorException(
          'Failed to process payment for the proposal',
        );
      }),
    );
  }

  private async findById(id: string): Promise<Proposal> {
    const proposal = await this.proposalRepository.findById(id);
    if (!proposal) throw new NotFoundException('Proposal not found');
    return proposal;
  }
}
