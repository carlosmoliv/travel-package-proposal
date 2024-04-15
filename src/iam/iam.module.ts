import { Module } from '@nestjs/common';
import { BcryptService } from './hashing/bcrypt/bcrypt.service';
import { HashingService } from './ports/hashing.service';

@Module({
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
  ],
})
export class IamModule {}
