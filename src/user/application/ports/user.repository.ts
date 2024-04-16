import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export abstract class UserRepository {
  abstract save(user: User): Promise<void>;
  abstract findByCriteria(
    criteria: Pick<User, 'name' | 'email'> & { id: string },
  ): Promise<User>;
}
