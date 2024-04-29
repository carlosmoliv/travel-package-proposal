import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user';

@Injectable()
export abstract class UserRepository {
  abstract save(user: User): Promise<void>;
  abstract findByCriteria(criteria: {
    id?: string;
    name?: string;
    email?: string;
  }): Promise<User>;
}
