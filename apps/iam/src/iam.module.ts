import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';

import { CommonModule } from '@app/common';

import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids/refresh-token-ids.storage';
import { typeOrmAsyncConfig } from './config/orm.config';
import { UserModule } from './user/user.module';
import { AuthenticationGuard } from '@app/common/iam/guards/authentication-guard/authentication.guard';
import { TokenService } from './shared/token/token.service';
import { JwtService } from './shared/token/jwt/jwt.service';
import { HashingService } from './shared/hashing/hashing.service';
import { BcryptService } from './shared/hashing/bcrypt/bcrypt.service';
import { IamController } from './iam.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { IAM_SERVICE } from '@app/common/iam/iam.constants';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    CommonModule,
    forwardRef(() => UserModule),
    ClientsModule.register([
      {
        name: IAM_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: 'iam_queue',
        },
      },
    ]),
  ],
  providers: [
    RefreshTokenIdsStorage,
    AuthenticationService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: TokenService,
      useClass: JwtService,
    },
    {
      provide: HashingService,
      useClass: BcryptService,
    },
  ],
  controllers: [AuthenticationController, IamController],
  exports: [HashingService],
})
export class IamModule {}
