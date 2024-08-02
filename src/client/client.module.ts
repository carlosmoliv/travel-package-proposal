import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrmClient } from './infrastructure/persitence/orm/entities/orm-client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrmClient])],
  providers: [],
})
export class ClientModule {}
