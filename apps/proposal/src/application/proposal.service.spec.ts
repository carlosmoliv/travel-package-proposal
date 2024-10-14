import { Test, TestingModule } from '@nestjs/testing';
import { ProposalService } from './proposal.service';
import { ClientProxy } from '@nestjs/microservices';
import { NotFoundException } from '@nestjs/common';
import { anyString, mock, MockProxy } from 'jest-mock-extended';
import { lastValueFrom, of } from 'rxjs';
import { ProposalRepository } from './ports/proposal.repository';
import { ProposalFactory } from '../domain/factories/proposal.factory';
import { CreateProposalInput } from './inputs/create-proposal.input';
import { IAM_SERVICE, TRAVEL_PACKAGE_SERVICE } from '@app/common/constants';
import { ProposalStatus } from '../domain/enums/proposal-status';
import objectContaining = jasmine.objectContaining;

describe('ProposalService', () => {
  let proposalService: ProposalService;
  let proposalRepository: MockProxy<ProposalRepository>;
  let iamClient: MockProxy<ClientProxy>;
  let travelPackageClient: MockProxy<ClientProxy>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProposalService,
        ProposalFactory,
        { provide: ProposalRepository, useValue: mock() },
        { provide: IAM_SERVICE, useValue: mock() },
        { provide: TRAVEL_PACKAGE_SERVICE, useValue: mock() },
      ],
    }).compile();

    proposalService = module.get<ProposalService>(ProposalService);
    proposalRepository =
      module.get<MockProxy<ProposalRepository>>(ProposalRepository);
    iamClient = module.get<MockProxy<ClientProxy>>(IAM_SERVICE);
    travelPackageClient = module.get<MockProxy<ClientProxy>>(
      TRAVEL_PACKAGE_SERVICE,
    );
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
          clientId: 'client_id',
          travelAgentId: 'agent_id',
          travelPackageId: 'package_id',
          status: ProposalStatus.Pending,
        }),
      );
    });
  });
});
