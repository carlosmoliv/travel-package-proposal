import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { BcryptService } from './hashing/bcrypt/bcrypt.service';
import { HashingService } from './ports/hashing.service';
import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { UserModule } from '../user/user.module';
import { JwtService } from './token/jwt/jwt.service';
import { TokenService } from './ports/token.service';
import jwtConfig from './token/jwt/jwt.config';
import iamConfig from './iam.config';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids.storage/refresh-token-ids.storage';
import { SharedModule } from '../shared/shared.module';
import { AuthenticationGuard } from './authentication/guards/authentication/authentication.guard';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrmPermission } from './authorization/persistence/orm/entities/permission.entity';
import { OrmRole } from '../user/infrastructure/persistance/orm/entities/orm-role.entity';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(iamConfig),
    TypeOrmModule.forFeature([OrmRole, OrmPermission]),
    UserModule,
    SharedModule,
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
  ],
  controllers: [AuthenticationController],
  exports: [AuthenticationService, SharedModule],
})
export class IamModule {}
