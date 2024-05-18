import { Injectable } from '@nestjs/common';

import { RolesRepository } from './ports/rolesRepository';
import { Role } from '../../user/domain/role';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}

  async getUserRoles(userId: string): Promise<Role[]> {
    return this.rolesRepository.findRolesByUserId(userId);
  }
}
