import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRepository } from './application/ports/user.repository';
import { OrmUserRepository } from './infrastructure/persistance/orm/repositories/orm-user.repository';
import { UserFactory } from './domain/factories/user.factory';
import { OrmUser } from './infrastructure/persistance/orm/entities/orm-user.entity';
import { UserController } from './presenters/controllers/user.controller';
import { UserService } from './application/user.service';
import { HashingService } from '../hashing/hashing.service';
import { BcryptService } from '../hashing/bcrypt/bcrypt.service';
import { IamModule } from '../iam.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrmUser]), forwardRef(() => IamModule)],
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
