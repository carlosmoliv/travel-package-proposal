import * as Joi from 'joi';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';

import {
  TRAVEL_PACKAGE_SERVICE,
  IAM_SERVICE,
  PAYMENT_SERVICE,
} from '@app/common/constants';

import { ProposalController } from './presenters/controllers/proposal.controller';
import { ProposalService } from './application/proposal.service';
import { ProposalRepository } from './application/ports/proposal.repository';
import { OrmProposalRepository } from './infrastructure/persistence/orm/repositories/orm-proposal.repository';
import { ProposalFactory } from './domain/factories/proposal.factory';
import { ProposalEntity } from './infrastructure/persistence/orm/entities/proposal.entity';
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
    TypeOrmModule.forFeature([ProposalEntity]),
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
    ClientsModule.register([
      {
        name: TRAVEL_PACKAGE_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URI],
          queue: 'travel_package_queue',
        },
      },
    ]),
    ClientsModule.register([
      {
        name: PAYMENT_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URI],
          queue: 'payment_queue',
        },
      },
    ]),
  ],
  controllers: [ProposalController],
  providers: [
    ProposalService,
    ProposalFactory,
    {
      provide: ProposalRepository,
      useClass: OrmProposalRepository,
    },
  ],
})
export class ProposalModule {}
