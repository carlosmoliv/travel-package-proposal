import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export abstract class UserRepository {
  abstract save(user: User): Promise<void>;
}
