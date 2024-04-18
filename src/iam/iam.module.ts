import { Module } from '@nestjs/common';
import { BcryptService } from './hashing/bcrypt/bcrypt.service';
import { HashingService } from './ports/hashing.service';
import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    AuthenticationService,
  ],
  controllers: [AuthenticationController],
  exports: [AuthenticationService],
})
export class IamModule {}
