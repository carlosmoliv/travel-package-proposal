import { genSalt, hash, compare } from 'bcryptjs';

import { Injectable } from '@nestjs/common';

import { HashingService } from '../hashing.service';

@Injectable()
export class BcryptService implements HashingService {
  async hash(data: string): Promise<string> {
    const salt = await genSalt();
    return hash(data, salt);
  }

  compare(data: string, encrypted: string): Promise<boolean> {
    return compare(data, encrypted);
  }
}
