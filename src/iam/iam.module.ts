import { Module } from '@nestjs/common';
import { BcryptService } from './hashing/bcrypt/bcrypt.service';
import { HashingService } from './ports/hashing.service';
import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { UserModule } from '../user/user.module';
import { JwtService } from './token/jwt/jwt.service';
import { TokenService } from './ports/token.service';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './token/jwt/jwt.config';
import { JwtModule } from '@nestjs/jwt';
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
    AuthenticationService,
    JwtService,
  ],
  controllers: [AuthenticationController],
  exports: [AuthenticationService],
})
export class IamModule {}
