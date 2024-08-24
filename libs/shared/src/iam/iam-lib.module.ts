import { Module } from '@nestjs/common';
import { RoleService } from '@app/shared/iam/authorization/role.service';
import { PermissionService } from '@app/shared/iam/authorization/permission.service';
import { RoleRepository } from '@app/shared/iam/authorization/ports/role.repository';
import { PermissionRepository } from '@app/shared/iam/authorization/ports/permission.repository';
import { OrmRoleRepository } from '@app/shared/iam/authorization/orm/repositories/orm-role.repository';
import { OrmPermissionRepository } from '@app/shared/iam/authorization/orm/repositories/orm-permission.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrmRole } from '@app/shared/iam/authorization/orm/entities/orm-role.entity';
import { OrmPermission } from '@app/shared/iam/authorization/orm/entities/orm-permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrmRole, OrmPermission])],
  providers: [
    RoleService,
    PermissionService,
    { provide: RoleRepository, useClass: OrmRoleRepository },
    { provide: PermissionRepository, useClass: OrmPermissionRepository },
  ],
  exports: [
    RoleService,
    PermissionService,
    RoleRepository,
    PermissionRepository,
  ],
})
export class IamLibModule {}
