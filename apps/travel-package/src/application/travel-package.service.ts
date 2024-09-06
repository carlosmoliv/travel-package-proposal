import { Injectable } from '@nestjs/common';

import { TravelPackageRepository } from './ports/travel-package.repository';
import { TravelPackageFactory } from '../domain/factories/travel-package.factory';
import { CreateTravelPackageInput } from './inputs/travel-package.input';

@Injectable()
export class TravelPackageService {
  constructor(
    private readonly travelPackageRepository: TravelPackageRepository,
    private readonly travelPackageFactory: TravelPackageFactory,
  ) {}

  async create(
    createTravelPackageInput: CreateTravelPackageInput,
  ): Promise<void> {
    const travelPackage = this.travelPackageFactory.create(
      createTravelPackageInput.name,
      createTravelPackageInput.destination,
      createTravelPackageInput.duration,
      createTravelPackageInput.price,
      createTravelPackageInput.imageUrl,
      createTravelPackageInput.description,
    );
    await this.travelPackageRepository.save(travelPackage);
  }
}
