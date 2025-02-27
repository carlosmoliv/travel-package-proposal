import { Repository } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { TravelPackageEntity } from '../entities/travel-package.entity';
import { OrmTravelPackageRepository } from './orm-travel-package.repository';
import { TravelPackage } from '../../../../domain/travel-pacckage';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
});

describe('TravelPackageRepositoryService', () => {
  let sut: OrmTravelPackageRepository;
  let ormRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrmTravelPackageRepository,
        {
          provide: getRepositoryToken(TravelPackageEntity),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    sut = module.get<OrmTravelPackageRepository>(OrmTravelPackageRepository);
    ormRepository = module.get<MockRepository>(
      getRepositoryToken(TravelPackageEntity),
    );
  });

  describe('save()', () => {
    test('persists a Travel Package on database', async () => {
      const travelPackage = new TravelPackage(
        null,
        'Beach Paradise',
        'Hawaii',
        7,
        999.99,
        'https://example.com/image.jpg',
        'A relaxing beach getaway',
      );
      ormRepository.create.mockReturnValue(travelPackage);
      ormRepository.save.mockResolvedValue(travelPackage);

      await sut.save(travelPackage);

      expect(ormRepository.create).toHaveBeenCalledWith(travelPackage);
      expect(ormRepository.save).toHaveBeenCalledWith(travelPackage);
    });
  });

  describe('findById()', () => {
    test('returns a travel package by ID', async () => {
      const id = 'any_id';
      const travelPackage = new TravelPackage(
        id,
        'Beach Paradise',
        'Hawaii',
        7,
        999.99,
        'https://example.com/image.jpg',
        'A relaxing beach getaway',
      );

      ormRepository.findOne.mockResolvedValue(travelPackage);

      const result = await sut.findById(id);

      expect(result).toEqual(travelPackage);
    });
  });
});
