import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { RolesRepository } from '../../../../application/ports/roles.repository';
import { Role } from '../../../../domain/role';
import { OrmRole } from '../entities/orm-role.entity';

@Injectable()
export class OrmRolesRepository implements RolesRepository {
  constructor(
    @InjectRepository(OrmRole)
    private readonly rolesRepository: Repository<OrmRole>,
  ) {}

  async save(role: Role): Promise<void> {
    await this.rolesRepository.save(role);
  }

  async findById(id: string): Promise<Role> {
    return this.rolesRepository.findOne({ where: { id: id } });
  }
}
