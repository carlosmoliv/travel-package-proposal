import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids/refresh-token-ids.storage';
import { RoleController } from './authorization/role.controller';
import { PermissionController } from './authorization/permission.controller';
import { SharedModule } from '@app/shared/shared.module';
import { IamLibModule } from '@app/shared/iam/iam-lib.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_SERVICE } from './iam.constants';
import { typeOrmAsyncConfig } from '../../travel-package-proposal-api/src/config/orm.config';

@Module({
  imports: [
    IamLibModule,
    ConfigModule.forRoot(),
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
  providers: [RefreshTokenIdsStorage, AuthenticationService],
  controllers: [AuthenticationController, RoleController, PermissionController],
  exports: [AuthenticationService, SharedModule],
})
export class IamModule {}
