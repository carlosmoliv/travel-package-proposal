import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRepository } from './application/ports/user.repository';
import { OrmUserRepository } from './infrastructure/persistance/orm/repositories/orm-user.repository';
import { UserFactory } from './domain/factories/user.factory';
import { OrmUser } from './infrastructure/persistance/orm/entities/orm-user.entity';
import { UserController } from './presenters/controllers/user.controller';
import { UserService } from './application/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrmUser])],
  providers: [
    UserFactory,
    {
      provide: UserRepository,
      useClass: OrmUserRepository,
    },
    UserService,
  ],
  controllers: [UserController],
  exports: [UserRepository, UserFactory],
})
export class UserModule {}
