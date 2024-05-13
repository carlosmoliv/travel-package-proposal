import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './ports/user.repository';
import { User } from '../domain/user';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getById(id: string): Promise<User> {
    const user = await this.userRepository.findByCriteria({ id });
    if (!user) throw new NotFoundException('User does not exist.');
    return user;
  }
}
