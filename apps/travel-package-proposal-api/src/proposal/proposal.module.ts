import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrmProposal } from './infrastructure/persitence/orm/entities/orm-proposal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrmProposal])],
})
export class ProposalModule {}
