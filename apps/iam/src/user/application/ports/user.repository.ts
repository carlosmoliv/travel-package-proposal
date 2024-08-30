import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user';

@Injectable()
export abstract class UserRepository {
  abstract save(user: User): Promise<void>;
  abstract findByEmail(email: string): Promise<User>;
  abstract findById(id: string): Promise<User>;
}
