import { Injectable } from '@nestjs/common';

import { RolesRepository } from './ports/roles.repository';
import { Role } from '../../user/domain/role';
import { NoRolesException } from '../../user/application/exceptions/node-roles.exception';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}

  async getUserRoles(userId: string): Promise<Role[]> {
    const roles = await this.rolesRepository.findRolesByUserId(userId);
    if (roles.length === 0) throw new NoRolesException();
    return roles;
  }
}
