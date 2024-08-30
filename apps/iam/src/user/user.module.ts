import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRepository } from './application/ports/user.repository';
import { OrmUserRepository } from './infrastructure/persistance/orm/repositories/orm-user.repository';
import { UserFactory } from './domain/factories/user.factory';
import { OrmUser } from './infrastructure/persistance/orm/entities/orm-user.entity';
import { UserController } from './presenters/controllers/user.controller';
import { UserService } from './application/user.service';
import { IamModule } from '../iam.module';
import { RoleModule } from '../authorization/role/role.module';
import { PermissionModule } from '../authorization/permission/permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrmUser]),
    forwardRef(() => IamModule),
    RoleModule,
    PermissionModule,
  ],
  providers: [
    UserFactory,
    UserService,
    {
      provide: UserRepository,
      useClass: OrmUserRepository,
    },
  ],
  controllers: [UserController],
  exports: [UserRepository, UserFactory, UserService],
})
export class UserModule {}
