import { Injectable } from '@nestjs/common';

import { TravelPackage } from '../../domain/travel-package';

@Injectable()
export abstract class TravelPackageRepository {
  abstract save(travelPackage: TravelPackage): Promise<void>;
  abstract findById(id: string): Promise<TravelPackage>;
}
