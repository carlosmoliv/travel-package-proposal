import { In, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { RoleRepository } from '@app/iam-lib/authorization/ports/role.repository';
import { Role } from '@app/iam-lib/authorization/role';
import { OrmRole } from './orm-role.entity';
import { RoleName } from '@app/iam-lib/authorization/enums/role-name.enum';

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
