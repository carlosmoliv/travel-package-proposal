import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../../application/ports/user.repository';
import { User } from '../../../../domain/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrmUser } from '../entities/orm-user.entity';

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
}
