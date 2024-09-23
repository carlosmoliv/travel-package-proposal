import { Module } from '@nestjs/common';

import { ProposalController } from './proposal.controller';
import { ProposalService } from './application/proposal.service';
import { ProposalRepository } from './application/ports/proposal.repository';
import { OrmProposalRepository } from './infrastructure/persistence/orm/repositories/orm-proposal.repository';
import { ProposalFactory } from './domain/factories/proposal.factory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrmProposal } from './infrastructure/persistence/orm/entities/orm-proposal.entity';
import { typeOrmAsyncConfig } from './config/orm.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    TypeOrmModule.forFeature([OrmProposal]),
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
