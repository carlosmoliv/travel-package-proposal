import { randomUUID } from 'crypto';

import { Injectable } from '@nestjs/common';

import { TravelPackage } from '../travel-pacckage';

@Injectable()
export class TravelPackageFactory {
  create(
    name: string,
    location: string,
    duration: number,
    price: number,
    imageUrl?: string,
    description?: string,
  ): TravelPackage {
    const travelPackageId = randomUUID();
    return new TravelPackage(
      travelPackageId,
      name,
      location,
      duration,
      price,
      imageUrl,
      description,
    );
  }
}
