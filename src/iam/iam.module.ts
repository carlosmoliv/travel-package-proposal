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

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(iamConfig),
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
    AuthenticationService,
    JwtService,
  ],
  controllers: [AuthenticationController],
  exports: [AuthenticationService],
})
export class IamModule {}
