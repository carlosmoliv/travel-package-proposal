import { Module } from '@nestjs/common';

import { TravelPackageController } from './presenters/controllers/travel-package.controller';
import { TravelPackageService } from './application/travel-package.service';
import { TravelPackageRepository } from './application/ports/travel-package.repository';
import { OrmTravelPackageRepository } from './infrastructure/persistence/orm/repositories/orm-travel-package.repository';

@Module({
  imports: [],
  controllers: [TravelPackageController],
  providers: [
    TravelPackageService,
    {
      provide: TravelPackageRepository,
      useClass: OrmTravelPackageRepository,
    },
  ],
})
export class TravelPackageModule {}
