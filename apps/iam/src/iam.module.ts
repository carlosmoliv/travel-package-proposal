import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';

import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { JwtService } from './token/jwt/jwt.service';
import { TokenService } from './ports/token.service';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids/refresh-token-ids.storage';
import { AuthenticationGuard } from './authentication/guards/authentication/authentication.guard';
import { RoleController } from './authorization/role.controller';
import jwtConfig from './token/jwt/jwt.config';
import { PermissionController } from './authorization/permission.controller';
import { SharedModule } from '@app/shared/shared.module';
import { IamLibModule } from '@app/shared/iam/iam-lib.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_SERVICE } from './iam.constants';
import { typeOrmAsyncConfig } from '../../travel-package-proposal-api/src/config/orm.config';

@Module({
  imports: [
    IamLibModule,
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forRoot(),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    SharedModule,
    ClientsModule.register([
      {
        name: USER_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'user_queue',
        },
      },
    ]),
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
  ],
  controllers: [AuthenticationController, RoleController, PermissionController],
  exports: [AuthenticationService, SharedModule],
})
export class IamModule {}
