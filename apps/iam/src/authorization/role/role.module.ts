import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleService } from './application/role.service';
import { RoleRepository } from './application/ports/role.repository';
import { OrmRoleRepository } from './infrastructure/orm/orm-role.repository';
import { OrmRole } from './infrastructure/orm/orm-role.entity';
import { RoleController } from './presenters/controllers/role.controller';
import { PermissionModule } from '../permission/permission.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrmRole]), PermissionModule],
  providers: [
    RoleService,
    {
      provide: RoleRepository,
      useClass: OrmRoleRepository,
    },
  ],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}
