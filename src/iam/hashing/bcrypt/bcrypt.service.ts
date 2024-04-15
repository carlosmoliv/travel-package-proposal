import { Injectable } from '@nestjs/common';
import { HashingService } from '../../ports/hashing.service';
import { genSalt, hash } from 'bcrypt';

@Injectable()
export class BcryptService implements HashingService {
  async hash(data: string | Buffer): Promise<string> {
    const salt = await genSalt();
    return hash(data, salt);
  }
}
