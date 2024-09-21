import { Repository } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { OrmProposalRepository } from './orm-travel-package.repository';
import { OrmProposal } from '../entities/orm-proposal.entity';
import { ProposalStatus } from '../../../../domain/enums/proposal-status';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  create: jest.fn(),
  save: jest.fn(),
});

describe('OrmProposalRepository', () => {
  let sut: OrmProposalRepository;
  let ormRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrmProposalRepository,
        {
          provide: getRepositoryToken(OrmProposal),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    sut = module.get<OrmProposalRepository>(OrmProposalRepository);
    ormRepository = module.get<MockRepository>(getRepositoryToken(OrmProposal));
  });

  describe('save()', () => {
    test('persists a proposal on the database', async () => {
      const proposal = new OrmProposal();
      proposal.id = 'any_id';
      proposal.clientId = 'client_id_123';
      proposal.travelPackageId = 'travel_package_id';
      proposal.travelAgentId = 'travel_agent_id';
      proposal.status = ProposalStatus.Pending;

      ormRepository.create.mockReturnValue(proposal);
      ormRepository.save.mockResolvedValue(proposal);

      await sut.save(proposal);

      expect(ormRepository.create).toHaveBeenCalledWith(proposal);
      expect(ormRepository.save).toHaveBeenCalledWith(proposal);
    });
  });
});
