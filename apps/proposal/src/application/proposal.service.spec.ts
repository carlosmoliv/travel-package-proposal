import { of, throwError } from 'rxjs';
import { mock, MockProxy } from 'jest-mock-extended';

import {
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';

import { ProposalService } from './proposal.service';
import { ProposalRepository } from './ports/proposal.repository';
import { ProposalFactory } from '../domain/factories/proposal.factory';
import { CreateProposalInput } from './inputs/create-proposal.input';
import {
  IAM_SERVICE,
  PAYMENT_SERVICE,
  TRAVEL_PACKAGE_SERVICE,
} from '@app/common/constants';
import { ProposalStatus } from '../domain/enums/proposal-status';
import { faker } from '@faker-js/faker';
import { Proposal } from '../domain/proposal';

describe('ProposalService', () => {
  let proposalService: ProposalService;
  let proposalRepository: MockProxy<ProposalRepository>;
  let iamClient: MockProxy<ClientProxy>;
  let travelPackageClient: MockProxy<ClientProxy>;
  let paymentClient: MockProxy<ClientProxy>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProposalService,
        ProposalFactory,
        { provide: ProposalRepository, useValue: mock() },
        { provide: IAM_SERVICE, useValue: mock() },
        { provide: TRAVEL_PACKAGE_SERVICE, useValue: mock() },
        { provide: PAYMENT_SERVICE, useValue: mock() },
      ],
    }).compile();

    proposalService = module.get<ProposalService>(ProposalService);
    proposalRepository =
      module.get<MockProxy<ProposalRepository>>(ProposalRepository);
    iamClient = module.get<MockProxy<ClientProxy>>(IAM_SERVICE);
    travelPackageClient = module.get<MockProxy<ClientProxy>>(
      TRAVEL_PACKAGE_SERVICE,
    );
    paymentClient = module.get<MockProxy<ClientProxy>>(PAYMENT_SERVICE);
  });

  describe('create', () => {
    let createProposalInput: CreateProposalInput;

    beforeAll(async () => {
      const travelPackageId = 'package_id';
      const travelAgentId = 'agent_id';
      const clientId = 'client_id';
      createProposalInput = {
        travelPackageId,
        travelAgentId,
        clientId,
        price: parseFloat(faker.commerce.price()),
      };
    });

    it('creates and saves a proposal if all entities exist', async () => {
      // Arrange
      iamClient.send.mockReturnValueOnce(of(true));
      iamClient.send.mockReturnValueOnce(of(true));
      travelPackageClient.send.mockReturnValueOnce(of(true));

      // Act
      await proposalService.create(createProposalInput);

      // Assert
      expect(proposalRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          clientId: 'client_id',
          travelAgentId: 'agent_id',
          travelPackageId: 'package_id',
          status: ProposalStatus.Pending,
          price: createProposalInput.price,
        }),
      );
    });

    it('should throw NotFoundException if client does not exist', async () => {
      iamClient.send.mockReturnValueOnce(of(false));
      iamClient.send.mockReturnValueOnce(of(true));
      travelPackageClient.send.mockReturnValueOnce(of(true));

      await expect(proposalService.create(createProposalInput)).rejects.toThrow(
        new NotFoundException('Client does not exist'),
      );
      expect(proposalRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if travel agent does not exist', async () => {
      iamClient.send.mockReturnValueOnce(of(true));
      iamClient.send.mockReturnValueOnce(of(false));
      travelPackageClient.send.mockReturnValueOnce(of(true));

      await expect(proposalService.create(createProposalInput)).rejects.toThrow(
        new NotFoundException('Travel agent does not exist'),
      );
      expect(proposalRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if travel package does not exist', async () => {
      iamClient.send.mockReturnValueOnce(of(true));
      iamClient.send.mockReturnValueOnce(of(true));
      travelPackageClient.send.mockReturnValueOnce(of(false));

      await expect(proposalService.create(createProposalInput)).rejects.toThrow(
        new NotFoundException('Travel package does not exist'),
      );
      expect(proposalRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('acceptProposal', () => {
    let proposal: Proposal;

    beforeEach(async () => {
      proposal = new Proposal(
        'proposal_id',
        'client_id',
        'travel_agent_id',
        'travel_package_id',
        ProposalStatus.Pending,
        100,
      );
    });

    it('should accept proposal successfully', async () => {
      proposalRepository.findById.mockResolvedValueOnce(proposal);

      await proposalService.acceptProposal(proposal.id);

      expect(proposalRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...proposal,
          status: ProposalStatus.Accepted,
        }),
      );
    });

    it('should throw NotFoundException if proposal does not exist', async () => {
      const proposalId = 'nonexistent_proposal_id';
      proposalRepository.findById.mockResolvedValueOnce(null);

      await expect(proposalService.acceptProposal(proposalId)).rejects.toThrow(
        new NotFoundException('Proposal not found'),
      );
      expect(proposalRepository.save).not.toHaveBeenCalled();
    });

    it('should throw UnprocessableEntityException when status is different from Pending', async () => {
      const proposalId = 'proposal_id';
      proposal.status = ProposalStatus.Accepted;
      proposalRepository.findById.mockResolvedValueOnce(proposal);

      await expect(proposalService.acceptProposal(proposalId)).rejects.toThrow(
        new UnprocessableEntityException(
          'You cannot accept a proposal already accepted or rejected',
        ),
      );
      expect(proposalRepository.save).not.toHaveBeenCalled();
    });

    it('should not change proposal if it is already accepted', async () => {
      const proposal = new Proposal(
        'proposal_id',
        'client_id',
        'travel_agent_id',
        'travel_package_id',
        ProposalStatus.Accepted,
        100,
      );
      proposalRepository.findById.mockResolvedValueOnce(proposal);

      const promise = proposalService.acceptProposal(proposal.id);

      await expect(promise).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe('payProposal()', () => {
    it('should process payment successfully', async () => {
      const checkoutUrl = 'https://checkout.url';
      const proposal = new Proposal(
        'proposal_id',
        'client_id',
        'travel_agent_id',
        'travel_package_id',
        ProposalStatus.Accepted,
        100,
      );
      proposalRepository.findById.mockResolvedValueOnce(proposal);
      paymentClient.send.mockReturnValueOnce(of(checkoutUrl));

      const result = await proposalService.payProposal(proposal.id);

      expect(result.checkoutUrl).toBe(checkoutUrl);
    });

    it('should throw InternalServerErrorException if payment creation fails', async () => {
      const proposal = new Proposal(
        'proposal_id',
        'client_id',
        'travel_agent_id',
        'travel_package_id',
        ProposalStatus.Accepted,
        100,
      );
      proposalRepository.findById.mockResolvedValueOnce(proposal);
      paymentClient.send.mockReturnValueOnce(
        throwError(() => new Error('Payment failure')),
      );

      await expect(proposalService.payProposal(proposal.id)).rejects.toThrow(
        new InternalServerErrorException(
          'Failed to create payment session for the proposal',
        ),
      );
      expect(proposalRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if proposal does not exist', async () => {
      const proposalId = 'nonexistent_proposal_id';
      proposalRepository.findById.mockResolvedValueOnce(null);

      await expect(proposalService.payProposal(proposalId)).rejects.toThrow(
        new NotFoundException('Proposal not found'),
      );
      expect(proposalRepository.save).not.toHaveBeenCalled();
    });

    it('should throw UnprocessableEntityException if proposal is not accepted', async () => {
      const proposal = new Proposal(
        'proposal_id',
        'client_id',
        'travel_agent_id',
        'travel_package_id',
        ProposalStatus.Pending,
        100,
      );
      proposalRepository.findById.mockResolvedValueOnce(proposal);

      await expect(proposalService.payProposal(proposal.id)).rejects.toThrow(
        new UnprocessableEntityException(
          "Cannot proceed with payment. Proposal status is 'pending'.",
        ),
      );
      expect(paymentClient.send).not.toHaveBeenCalled();
      expect(proposalRepository.save).not.toHaveBeenCalled();
    });
  });
});
