import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';

import { User } from '../entities/user.entity';

@Injectable()
export class UserFactory {
  create(name: string, email: string, password: string, id?: string) {
    const userId = id ?? randomUUID();
    const user = new User(userId);
    user.name = name;
    user.email = email;
    user.password = password;
    return user;
  }
}
