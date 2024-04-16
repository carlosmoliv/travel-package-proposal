import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';

@Injectable()
export class UserFactory {
  create(name: string, email: string, password: string) {
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = password;
    return user;
  }
}
