import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';

import { BcryptService } from './hashing/bcrypt/bcrypt.service';
import { HashingService } from './ports/hashing.service';
import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { UserModule } from '../user/user.module';
import { JwtService } from './token/jwt/jwt.service';
import { TokenService } from './ports/token.service';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids.storage/refresh-token-ids.storage';
import { SharedModule } from '../shared/shared.module';
import { AuthenticationGuard } from './authentication/guards/authentication/authentication.guard';
import { OrmPermission } from './authorization/persistence/orm/entities/orm-permission.entity';
import { OrmRole } from '../user/infrastructure/persistance/orm/entities/orm-role.entity';
import { RolesService } from './authorization/roles.service';
import { PermissionsService } from './authorization/permissions.service';
import { RolesController } from './authorization/roles.controller';
import jwtConfig from './token/jwt/jwt.config';
import iamConfig from './iam.config';
import { RolesRepository } from './authorization/ports/roles.repository';
import { OrmRolesRepository } from './authorization/persistence/orm/repositories/orm-roles.repository';
import { PermissionsRepository } from './authorization/ports/permissions.repository';
import { Permission } from './authorization/permission';

class DummyPermissionsRepository implements PermissionsRepository {
  findByRoles(roleIds: string[]): Promise<Permission[]> {
    return Promise.resolve([]);
  }
}

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
    RolesService,
    PermissionsService,
    {
      provide: RolesRepository,
      useClass: OrmRolesRepository,
    },
    {
      provide: PermissionsRepository,
      useClass: DummyPermissionsRepository,
    },
  ],
  controllers: [AuthenticationController, RolesController],
  exports: [
    AuthenticationService,
    PermissionsService,
    RolesRepository,
    PermissionsRepository,
    SharedModule,
  ],
})
export class IamModule {}
