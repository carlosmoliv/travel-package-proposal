import { Injectable } from '@nestjs/common';
import { CreateTravelPackageInput } from './inputs/create-travel-package.input';
import { TravelPackageRepository } from './ports/travel-package.repository';
import { TravelPackage } from '../domain/travel-package';

@Injectable()
export class TravelPackageService {
  constructor(
    private readonly travelPackageRepository: TravelPackageRepository,
  ) {}

  async create(
    createTravelPackageInput: CreateTravelPackageInput,
  ): Promise<void> {
    const travelPackage = new TravelPackage(
      createTravelPackageInput.name,
      createTravelPackageInput.destination,
      createTravelPackageInput.duration,
      createTravelPackageInput.price,
      createTravelPackageInput.imageUrl,
      createTravelPackageInput.description,
    );
    return this.travelPackageRepository.save(travelPackage);
  }
}
