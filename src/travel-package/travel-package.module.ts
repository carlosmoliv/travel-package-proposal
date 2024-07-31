import { Module } from '@nestjs/common';

import { TravelPackageService } from './application/travel-package.service';
import { OrmTravelPackageRepository } from './infrastructure/persistence/orm/repositories/orm-travel-package.repository';
import { TravelPackageRepository } from './application/ports/travel-package.repository';

@Module({
  providers: [
    TravelPackageService,
    {
      provide: TravelPackageRepository,
      useClass: OrmTravelPackageRepository,
    },
  ],
})
export class TravelPackageModule {}
