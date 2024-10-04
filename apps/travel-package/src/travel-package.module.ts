import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { IAM_SERVICE } from '@app/common/constants';

import { AuthenticationGuard } from '@app/common/iam/guards/authentication-guard/authentication.guard';

import { TravelPackageController } from './presenters/controllers/travel-package.controller';
import { TravelPackageService } from './application/travel-package.service';
import { TravelPackageRepository } from './application/ports/travel-package.repository';
import { OrmTravelPackageRepository } from './infrastructure/persistence/orm/repositories/orm-travel-package.repository';
import { TravelPackageFactory } from './domain/factories/travel-package.factory';
import { OrmTravelPackage } from './infrastructure/persistence/orm/entities/orm-travel-package.entity';
import { typeOrmAsyncConfig } from './config/orm.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    TypeOrmModule.forFeature([OrmTravelPackage]),
    ClientsModule.register([
      {
        name: IAM_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URI],
          queue: 'iam_queue',
        },
      },
    ]),
  ],
  controllers: [TravelPackageController],
  providers: [
    TravelPackageService,
    TravelPackageFactory,
    {
      provide: TravelPackageRepository,
      useClass: OrmTravelPackageRepository,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
})
export class TravelPackageModule {}
