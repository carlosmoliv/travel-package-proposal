import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids/refresh-token-ids.storage';
import { RoleController } from './authorization/role.controller';
import { PermissionController } from './authorization/permission.controller';
import { SharedModule } from '@app/shared/shared.module';
import { IamLibModule } from '@app/shared/iam/iam-lib.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_SERVICE } from './iam.constants';
import { typeOrmAsyncConfig } from '../../travel-package-proposal-api/src/config/orm.config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // validationSchema: Joi.object({
      //   PORT: Joi.number().required(),
      //
      //   DATABASE_HOST: Joi.string().required(),
      //   DATABASE_USER: Joi.string().required(),
      //   DATABASE_PASSWORD: Joi.string().required(),
      //   DATABASE_NAME: Joi.string().required(),
      //   DATABASE_PORT: Joi.string().required(),
      //
      //   JWT_SECRET: Joi.string().required(),
      //   JWT_TOKEN_AUDIENCE: Joi.string().required(),
      //   JWT_TOKEN_ISSUER: Joi.string().required(),
      //
      //   ACCESS_TOKEN_TTL: Joi.number().required(),
      //   REFRESH_TOKEN_TTL: Joi.number().required(),
      //
      //   REDIS_HOST: Joi.string().required(),
      //   REDIS_PORT: Joi.number().required(),
      //
      //   RABBITMQ_URL: Joi.string().required(),
      // }),
    }),
    IamLibModule,
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    SharedModule,
    ClientsModule.register([
      {
        name: USER_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'user_queue',
        },
      },
    ]),
  ],
  providers: [RefreshTokenIdsStorage, AuthenticationService],
  controllers: [AuthenticationController, RoleController, PermissionController],
  exports: [AuthenticationService, SharedModule],
})
export class IamModule {}
