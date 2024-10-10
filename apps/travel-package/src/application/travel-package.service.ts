import { Injectable, NotFoundException } from '@nestjs/common';

import { TravelPackageRepository } from './ports/travel-package.repository';
import { TravelPackageFactory } from '../domain/factories/travel-package.factory';
import { CreateTravelPackageInput } from './inputs/travel-package.input';
import { TravelPackage } from '../domain/travel-pacckage';

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

  async findById(id: string): Promise<TravelPackage> {
    const travelPackage = await this.travelPackageRepository.findById(id);
    if (!travelPackage) {
      throw new NotFoundException(
        `Travel Package with ID "${id}" does not exist.`,
      );
    }
    return travelPackage;
  }
}
