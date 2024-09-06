import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { OrmTravelPackage } from '../entities/orm-travel-package.entity';
import { TravelPackage } from '../../../../domain/travel-pacckage';
import { TravelPackageRepository } from '../../../../application/ports/travel-package.repository';

@Injectable()
export class OrmTravelPackageRepository implements TravelPackageRepository {
  constructor(
    @InjectRepository(OrmTravelPackage)
    private readonly travelPackageRepository: Repository<OrmTravelPackage>,
  ) {}

  async save(travelPackage: TravelPackage): Promise<void> {
    const travelPackageInstance =
      this.travelPackageRepository.create(travelPackage);
    await this.travelPackageRepository.save(travelPackageInstance);
  }

  async findById(id: string): Promise<TravelPackage> {
    return this.travelPackageRepository.findOne({ where: { id } });
  }
}
