import { Repository } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { OrmProposalRepository } from './orm-proposal.repository';
import { ProposalEntity } from '../entities/proposal.entity';
import { ProposalStatus } from '../../../../domain/enums/proposal-status';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
});

describe('OrmProposalRepository', () => {
  let sut: OrmProposalRepository;
  let ormRepository: MockRepository;
  let proposal: ProposalEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrmProposalRepository,
        {
          provide: getRepositoryToken(ProposalEntity),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    sut = module.get<OrmProposalRepository>(OrmProposalRepository);
    ormRepository = module.get<MockRepository>(
      getRepositoryToken(ProposalEntity),
    );
  });

  beforeAll(async () => {
    proposal = new ProposalEntity();
    proposal.id = 'any_id';
    proposal.clientId = 'client_id_123';
    proposal.travelPackageId = 'travel_package_id';
    proposal.travelAgentId = 'travel_agent_id';
    proposal.status = ProposalStatus.Pending;
  });

  describe('save()', () => {
    test('persists a proposal on the database', async () => {
      ormRepository.create.mockReturnValue(proposal);
      ormRepository.save.mockResolvedValue(proposal);

      await sut.save(proposal);

      expect(ormRepository.create).toHaveBeenCalledWith(proposal);
      expect(ormRepository.save).toHaveBeenCalledWith(proposal);
    });
  });

  describe('findById()', () => {
    test('returns a proposal when found', async () => {
      ormRepository.findOne.mockResolvedValue(proposal);

      const result = await sut.findById(proposal.id);

      expect(ormRepository.findOne).toHaveBeenCalledWith({
        where: { id: proposal.id },
      });
      expect(result).toEqual(proposal);
    });
  });
});
