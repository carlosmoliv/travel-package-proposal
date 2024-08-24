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
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from '@app/shared/iam/authentication/guards/authentication/authentication.guard';
import { TokenService } from './ports/token.service';
import { JwtService } from '@app/shared/iam/token/jwt/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from '@app/shared/iam/token/jwt/jwt.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrmRole, OrmPermission]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  providers: [
    RoleService,
    PermissionService,
    { provide: RoleRepository, useClass: OrmRoleRepository },
    { provide: PermissionRepository, useClass: OrmPermissionRepository },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: TokenService,
      useClass: JwtService,
    },
  ],
  exports: [
    RoleService,
    PermissionService,
    RoleRepository,
    PermissionRepository,
    TokenService,
  ],
})
export class IamLibModule {}
