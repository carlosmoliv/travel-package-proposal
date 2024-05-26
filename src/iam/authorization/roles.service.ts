import { Injectable } from '@nestjs/common';

import { RolesRepository } from './ports/roles.repository';
import { CreateRoleInput } from './inputs/create-role.input';
import { Role } from './role';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}

  async create(input: CreateRoleInput): Promise<void> {
    const role = new Role(input.name);
    role.description = input.description;
    return this.rolesRepository.save(role);
  }
}
