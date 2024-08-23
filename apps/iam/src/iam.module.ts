import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';

import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { UserModule } from '../user/user.module';
import { JwtService } from './token/jwt/jwt.service';
import { TokenService } from './ports/token.service';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids/refresh-token-ids.storage';
import { AuthenticationGuard } from './authentication/guards/authentication/authentication.guard';
import { OrmPermission } from './authorization/orm/entities/orm-permission.entity';
import { OrmRole } from './authorization/orm/entities/orm-role.entity';
import { RoleService } from './authorization/role.service';
import { PermissionService } from './authorization/permission.service';
import { RoleController } from './authorization/role.controller';
import jwtConfig from './token/jwt/jwt.config';
import iamConfig from './iam.config';
import { RoleRepository } from './authorization/ports/role.repository';
import { OrmRoleRepository } from './authorization/orm/repositories/orm-role.repository';
import { PermissionRepository } from './authorization/ports/permission.repository';
import { PermissionController } from './authorization/permission.controller';
import { OrmPermissionRepository } from './authorization/orm/repositories/orm-permission.repository';
import { SharedModule } from '@app/shared';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(iamConfig),
    TypeOrmModule.forFeature([OrmRole, OrmPermission]),
    SharedModule,
    forwardRef(() => UserModule),
  ],
  providers: [
    {
      provide: TokenService,
      useClass: JwtService,
    },
    RefreshTokenIdsStorage,
    AuthenticationService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
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
  exports: [
    AuthenticationService,
    PermissionService,
    RoleService,
    RoleRepository,
    PermissionRepository,
    SharedModule,
  ],
})
export class IamModule {}
