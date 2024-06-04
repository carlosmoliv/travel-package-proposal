import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { OrmRole } from '../entities/orm-role.entity';
import { PermissionsRepository } from '../../../../application/ports/permissions.repository';
import { OrmPermission } from '../entities/orm-permission.entity';
import { Permission } from '../../../../domain/permission';

@Injectable()
export class OrmPermissionsRepository implements PermissionsRepository {
  constructor(
    @InjectRepository(OrmPermission)
    private readonly rolesRepository: Repository<OrmRole>,
  ) {}

  async save(permission: Permission): Promise<void> {
    await this.rolesRepository.save(permission);
  }

  findByRoles(roleIds: string[]): Promise<Permission[]> {
    return Promise.resolve([]);
  }
}
