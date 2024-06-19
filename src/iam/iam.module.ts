import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';

import { BcryptService } from './hashing/bcrypt/bcrypt.service';
import { HashingService } from './ports/hashing.service';
import { AuthenticationService } from './authentication/application/authentication.service';
import { AuthenticationController } from './authentication/presenters/controllers/authentication.controller';
import { UserModule } from '../user/user.module';
import { JwtService } from './token/jwt/jwt.service';
import { TokenService } from './ports/token.service';
import { RefreshTokenIdsStorage } from './authentication/infrastructure/refresh-token-ids/refresh-token-ids.storage';
import { SharedModule } from '../shared/shared.module';
import { AuthenticationGuard } from './authentication/application/guards/authentication/authentication.guard';
import { OrmPermission } from './authorization/infrastructure/persistence/orm/entities/orm-permission.entity';
import { OrmRole } from './authorization/infrastructure/persistence/orm/entities/orm-role.entity';
import { RoleService } from './authorization/application/role.service';
import { PermissionService } from './authorization/application/permission.service';
import { RoleController } from './authorization/presenters/controllers/role.controller';
import jwtConfig from './token/jwt/jwt.config';
import iamConfig from './iam.config';
import { RoleRepository } from './authorization/application/ports/role.repository';
import { OrmRoleRepository } from './authorization/infrastructure/persistence/orm/repositories/orm-role.repository';
import { PermissionRepository } from './authorization/application/ports/permission.repository';
import { PermissionController } from './authorization/presenters/controllers/permission.controller';
import { OrmPermissionRepository } from './authorization/infrastructure/persistence/orm/repositories/orm-permission.repository';

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
      provide: HashingService,
      useClass: BcryptService,
    },
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
