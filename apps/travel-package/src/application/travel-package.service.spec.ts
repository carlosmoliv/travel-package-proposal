import { anyString, mock, MockProxy } from 'jest-mock-extended';

import { Test, TestingModule } from '@nestjs/testing';

import { TravelPackageRepository } from './ports/travel-package.repository';
import { TravelPackageFactory } from '../domain/factories/travel-package.factory';
import { CreateTravelPackageInput } from './inputs/travel-package.input';
import { TravelPackageService } from './travel-package.service';
import { TravelPackage } from '../domain/travel-pacckage';

describe('TravelPackageService', () => {
  let sut: TravelPackageService;
  let travelPackageRepository: MockProxy<TravelPackageRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TravelPackageService,
        TravelPackageFactory,
        {
          provide: TravelPackageRepository,
          useValue: mock(),
        },
      ],
    }).compile();

    sut = module.get<TravelPackageService>(TravelPackageService);
    travelPackageRepository = module.get<MockProxy<TravelPackageRepository>>(
      TravelPackageRepository,
    );
  });

  describe('create()', () => {
    test('create a travel package', async () => {
      const createTravelPackageInput: CreateTravelPackageInput = {
        name: 'Beach Paradise',
        description: 'A relaxing beach getaway',
        destination: 'Hawaii',
        duration: 7,
        price: 999.99,
        imageUrl: 'https://example.com/image.jpg',
      };
      travelPackageRepository.save.mockResolvedValue();

      await sut.create(createTravelPackageInput);

      expect(travelPackageRepository.save).toHaveBeenCalledWith({
        id: anyString(),
        ...createTravelPackageInput,
      });
    });
  });

  describe('checkIfExists()', () => {
    test('Returns true if user exists', async () => {
      const travelPackage = new TravelPackage(
        'any_id',
        'any name',
        'any destination',
        12,
        3000,
      );
      travelPackageRepository.findById.mockResolvedValueOnce(travelPackage);

      const result = await sut.checkIfExists(travelPackage.id);

      expect(result).toBe(true);
    });

    test('Returns false if user does not exist', async () => {
      travelPackageRepository.findById.mockResolvedValueOnce(undefined);

      const result = await sut.checkIfExists('nonexistent_id');

      expect(result).toBe(false);
    });
  });
});
