import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids/refresh-token-ids.storage';
import { RoleController } from './authorization/role/presenters/controllers/role.controller';
import { PermissionController } from './authorization/permission/presenters/controllers/permission.controller';
import { typeOrmAsyncConfig } from './config/orm.config';
import { CommonModule } from '@app/common';
import { RoleRepository } from './authorization/ports/role.repository';
import { OrmRoleRepository } from './authorization/role/infrastructure/orm/orm-role.repository';
import { PermissionRepository } from './authorization/ports/permission.repository';
import { OrmPermissionRepository } from './authorization/permission/infrastructure/orm/orm-permission.repository';
import { OrmRole } from './authorization/role/infrastructure/orm/orm-role.entity';
import { OrmPermission } from './authorization/permission/infrastructure/orm/orm-permission.entity';
import { RoleService } from './authorization/role/application/role.service';
import { PermissionService } from './authorization/permission/application/permission.service';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './authentication/guards/authentication/authentication.guard';
import { TokenService } from './token/token.service';
import { JwtService } from './token/jwt/jwt.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
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
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: TokenService,
      useClass: JwtService,
    },
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
