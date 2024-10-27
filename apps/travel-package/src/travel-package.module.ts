import * as Joi from 'joi';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';

import { IAM_SERVICE } from '@app/common/constants';
import { AuthenticationGuard } from '@app/common/iam/guards/authentication-guard/authentication.guard';
import { PermissionGuard } from '@app/common/iam/guards/permission-guard/permission.guard';

import { TravelPackageController } from './presenters/controllers/travel-package.controller';
import { TravelPackageService } from './application/travel-package.service';
import { TravelPackageRepository } from './application/ports/travel-package.repository';
import { OrmTravelPackageRepository } from './infrastructure/persistence/orm/repositories/orm-travel-package.repository';
import { TravelPackageFactory } from './domain/factories/travel-package.factory';
import { OrmTravelPackage } from './infrastructure/persistence/orm/entities/orm-travel-package.entity';
import { typeOrmAsyncConfig } from './config/orm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        RABBITMQ_URI: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
      }),
    }),
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
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class TravelPackageModule {}
