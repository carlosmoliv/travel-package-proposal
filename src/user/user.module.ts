import { Module } from '@nestjs/common';
import { UserRepository } from './application/ports/user.repository';
import { OrmUserRepository } from './infrastructure/persistance/orm/repositories/orm-user.repository';
import { UserFactory } from './domain/factories/user.factory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrmUser } from './infrastructure/persistance/orm/entities/orm-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrmUser])],
  providers: [
    UserFactory,
    {
      provide: UserRepository,
      useClass: OrmUserRepository,
    },
  ],
  exports: [UserRepository, UserFactory],
})
export class UserModule {}
