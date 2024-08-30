import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserRepository } from '../../../../application/ports/user.repository';
import { OrmUser } from '../entities/orm-user.entity';
import { UserMapper } from '../mappers/user.mapper';
import { User } from '../../../../domain/user';

@Injectable()
export class OrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(OrmUser)
    private readonly userRepository: Repository<OrmUser>,
  ) {}

  async save(user: User): Promise<void> {
    const userInstance = this.userRepository.create(user);
    await this.userRepository.save(userInstance);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user && UserMapper.toDomain(user);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    return user && UserMapper.toDomain(user);
  }
}
