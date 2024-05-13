import { Injectable } from '@nestjs/common';
import { UserRepository } from './ports/user.repository';
import { User } from '../domain/user';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getById(id: string): Promise<User> {
    return this.userRepository.findByCriteria({ id });
  }
}
