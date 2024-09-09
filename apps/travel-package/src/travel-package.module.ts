import { Module } from '@nestjs/common';

import { TravelPackageController } from './presenters/controllers/travel-package.controller';
import { TravelPackageService } from './application/travel-package.service';
import { TravelPackageRepository } from './application/ports/travel-package.repository';
import { OrmTravelPackageRepository } from './infrastructure/persistence/orm/repositories/orm-travel-package.repository';
import { TravelPackageFactory } from './domain/factories/travel-package.factory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrmTravelPackage } from './infrastructure/persistence/orm/entities/orm-travel-package.entity';
import { typeOrmAsyncConfig } from './config/orm.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    TypeOrmModule.forFeature([OrmTravelPackage]),
  ],
  controllers: [TravelPackageController],
  providers: [
    TravelPackageService,
    TravelPackageFactory,
    {
      provide: TravelPackageRepository,
      useClass: OrmTravelPackageRepository,
    },
  ],
})
export class TravelPackageModule {}
