import { Module } from '@nestjs/common';
import { RoleService } from '@app/iam-lib/authorization/role.service';
import { PermissionService } from '@app/iam-lib/authorization/permission.service';
import { RoleRepository } from '@app/iam-lib/authorization/ports/role.repository';
import { PermissionRepository } from '@app/iam-lib/authorization/ports/permission.repository';
import { OrmRoleRepository } from '@app/iam-lib/authorization/orm/repositories/orm-role.repository';
import { OrmPermissionRepository } from '@app/iam-lib/authorization/orm/repositories/orm-permission.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrmRole } from '@app/iam-lib/authorization/orm/entities/orm-role.entity';
import { OrmPermission } from '@app/iam-lib/authorization/orm/entities/orm-permission.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from '@app/iam-lib/authentication/guards/authentication/authentication.guard';
import { TokenService } from '@app/iam-lib/token/token.service';
import { JwtService } from '@app/iam-lib/token/jwt/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrmRole, OrmPermission]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
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
