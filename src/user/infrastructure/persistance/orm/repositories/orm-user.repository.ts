import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../../application/ports/user.repository';
import { User } from '../../../../domain/user';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrmUser } from '../entities/orm-user.entity';
import { UserMapper } from '../mappers/user.mapper';

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

  async findByCriteria(criteria: {
    id?: string;
    name?: string;
    email?: string;
  }): Promise<User> {
    const user = await this.userRepository.findOne({ where: criteria });
    return user && UserMapper.toDomain(user);
  }
}
