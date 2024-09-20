import { anyString, mock, MockProxy } from 'jest-mock-extended';

import { Test, TestingModule } from '@nestjs/testing';

import { ProposalService } from './proposal.service';
import { ProposalRepository } from './ports/proposal.repository';
import { CreateProposalInput } from './inputs/create-proposal.input';
import { ProposalFactory } from '../domain/factories/proposal.factory';
import { ProposalStatus } from '../domain/enums/proposal-status';

describe('ProposalService', () => {
  let sut: ProposalService;
  let proposalRepository: MockProxy<ProposalRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProposalService,
        ProposalFactory,
        {
          provide: ProposalRepository,
          useValue: mock(),
        },
      ],
    }).compile();

    sut = module.get<ProposalService>(ProposalService);
    proposalRepository =
      module.get<MockProxy<ProposalRepository>>(ProposalRepository);
  });

  describe('create()', () => {
    test('creates a proposal', async () => {
      const createProposalInput: CreateProposalInput = {
        clientId: 'client123',
        travelAgentId: 'agent123',
        travelPackageId: 'package123',
      };

      proposalRepository.save.mockResolvedValue();

      await sut.create(createProposalInput);

      expect(proposalRepository.save).toHaveBeenCalledWith({
        id: anyString(),
        clientId: 'client123',
        travelAgentId: 'agent123',
        travelPackageId: 'package123',
        status: ProposalStatus.Pending,
      });
    });
  });
});
