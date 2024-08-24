import { In, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { RoleRepository } from '@app/shared/iam/authorization/ports/role.repository';
import { Role } from '@app/shared/iam/authorization/role';
import { OrmRole } from '@app/shared/iam/authorization/orm/entities/orm-role.entity';
import { RoleName } from '@app/shared';

@Injectable()
export class OrmRoleRepository implements RoleRepository {
  constructor(
    @InjectRepository(OrmRole)
    private readonly rolesRepository: Repository<OrmRole>,
  ) {}

  async save(role: Role): Promise<Role> {
    return this.rolesRepository.save(role);
  }

  async findById(id: string): Promise<Role> {
    return this.rolesRepository.findOne({ where: { id: id } });
  }

  async findByIds(id: string[]): Promise<Role[]> {
    return this.rolesRepository.find({
      where: {
        id: In(id),
      },
    });
  }

  async findByNames(roleNames: RoleName[]): Promise<Role[]> {
    return this.rolesRepository.find({
      where: {
        name: In(roleNames),
      },
    });
  }
}
