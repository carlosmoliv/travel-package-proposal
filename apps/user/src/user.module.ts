import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRepository } from './application/ports/user.repository';
import { OrmUserRepository } from './infrastructure/persistance/orm/repositories/orm-user.repository';
import { UserFactory } from './domain/factories/user.factory';
import { OrmUser } from './infrastructure/persistance/orm/entities/orm-user.entity';
import { UserController } from './presenters/controllers/user.controller';
import { UserService } from './application/user.service';
import { IamLibModule, HashingService, BcryptService } from '@app/shared';
import { ConfigModule } from '@nestjs/config';
import { typeOrmAsyncConfig } from './config/orm.config';
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
    TypeOrmModule.forFeature([OrmUser]),
  ],
  providers: [
    UserFactory,
    UserService,
    {
      provide: UserRepository,
      useClass: OrmUserRepository,
    },
    {
      provide: HashingService,
      useClass: BcryptService,
    },
  ],
  controllers: [UserController],
  exports: [UserRepository, UserFactory, UserService],
})
export class UserModule {}
