import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids/refresh-token-ids.storage';
import { RoleController } from './authorization/role/presenters/controllers/role.controller';
import { PermissionController } from './authorization/permission/presenters/controllers/permission.controller';
import { IamLibModule } from '@app/iam-lib/iam-lib.module';
import { typeOrmAsyncConfig } from './config/orm.config';
import { CommonModule } from '@app/common';
import { RoleRepository } from '@app/iam-lib/authorization/ports/role.repository';
import { OrmRoleRepository } from './authorization/role/infrastructure/orm/orm-role.repository';
import { PermissionRepository } from '@app/iam-lib/authorization/ports/permission.repository';
import { OrmPermissionRepository } from './authorization/permission/infrastructure/orm/orm-permission.repository';
import { OrmRole } from './authorization/role/infrastructure/orm/orm-role.entity';
import { OrmPermission } from './authorization/permission/infrastructure/orm/orm-permission.entity';
import { RoleService } from './authorization/role/application/role.service';
import { PermissionService } from './authorization/permission/application/permission.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    IamLibModule,
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    TypeOrmModule.forFeature([OrmRole, OrmPermission]),
    CommonModule,
    UserModule,
  ],
  providers: [
    RefreshTokenIdsStorage,
    AuthenticationService,
    RoleService,
    PermissionService,
    {
      provide: RoleRepository,
      useClass: OrmRoleRepository,
    },
    {
      provide: PermissionRepository,
      useClass: OrmPermissionRepository,
    },
  ],
  controllers: [AuthenticationController, RoleController, PermissionController],
  exports: [RoleService, PermissionService],
})
export class IamModule {}
