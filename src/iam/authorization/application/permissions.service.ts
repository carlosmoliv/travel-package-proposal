import { Injectable } from '@nestjs/common';

import { PermissionsRepository } from './ports/permissions.repository';
import { Permission } from '../domain/permission';

@Injectable()
export class PermissionsService {
  constructor(private readonly permissionsRepository: PermissionsRepository) {}

  async getByRoles(roleIds: string[]): Promise<Permission[]> {
    return this.permissionsRepository.findByRoles(roleIds);
  }
}
