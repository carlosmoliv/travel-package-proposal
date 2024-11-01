import { In, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { RoleRepository } from '../../application/ports/role.repository';
import { Role } from '../../domain/role';
import { RoleEntity } from './role.entity';
import { RoleName } from '../../domain/enums/role-name.enum';

@Injectable()
export class OrmRoleRepository implements RoleRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly rolesRepository: Repository<RoleEntity>,
  ) {}

  async save(role: Role): Promise<Role> {
    return this.rolesRepository.save(role);
  }

  async findById(id: string): Promise<Role> {
    return this.rolesRepository.findOne({ where: { id: id } });
  }

  async findByNames(roleNames: RoleName[]): Promise<Role[]> {
    return this.rolesRepository.find({
      where: {
        name: In(roleNames),
      },
    });
  }
}
