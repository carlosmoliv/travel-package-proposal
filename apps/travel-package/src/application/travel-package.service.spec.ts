import { anyString, mock, MockProxy } from 'jest-mock-extended';

import { Test, TestingModule } from '@nestjs/testing';

import { TravelPackageRepository } from './ports/travel-package.repository';
import { TravelPackageFactory } from '../domain/factories/travel-package.factory';
import { CreateTravelPackageInput } from './inputs/travel-package.input';
import { TravelPackageService } from './travel-package.service';

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
});
