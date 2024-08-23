import { Module } from '@nestjs/common';

import { TravelPackageService } from './application/travel-package.service';
import { OrmTravelPackageRepository } from './infrastructure/persistence/orm/repositories/orm-travel-package.repository';
import { TravelPackageRepository } from './application/ports/travel-package.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrmTravelPackage } from './infrastructure/persistence/orm/entities/orm-travel-package.entity';
import { TravelPackageController } from './presenters/controllers/travel-package.controller';
import { TravelPackageFactory } from './domain/factories/travel-package.factory';

@Module({
  imports: [TypeOrmModule.forFeature([OrmTravelPackage])],
  providers: [
    TravelPackageService,
    TravelPackageFactory,
    {
      provide: TravelPackageRepository,
      useClass: OrmTravelPackageRepository,
    },
  ],
  controllers: [TravelPackageController],
  exports: [TravelPackageRepository, TravelPackageService],
})
export class TravelPackageModule {}
