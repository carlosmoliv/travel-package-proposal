import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from '@app/iam-lib/authentication/guards/authentication/authentication.guard';
import { TokenService } from '@app/iam-lib/token/token.service';
import { JwtService } from '@app/iam-lib/token/jwt/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrmRole } from '../../../apps/iam/src/authorization/role/infrastructure/orm/orm-role.entity';
import { OrmPermission } from '../../../apps/iam/src/authorization/permission/infrastructure/orm/orm-permission.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([OrmRole, OrmPermission]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: TokenService,
      useClass: JwtService,
    },
  ],
  exports: [TokenService],
})
export class IamLibModule {}
