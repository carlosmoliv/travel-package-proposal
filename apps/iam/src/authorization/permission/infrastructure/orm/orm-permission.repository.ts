import { In, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PermissionRepository } from '@app/iam-lib/authorization/ports/permission.repository';
import { OrmPermission } from './orm-permission.entity';
import { Permission } from '@app/iam-lib/authorization/permission';
import { PermissionMapper } from './permission.mapper';

@Injectable()
export class OrmPermissionRepository implements PermissionRepository {
  constructor(
    @InjectRepository(OrmPermission)
    private readonly permissionRepository: Repository<OrmPermission>,
  ) {}

  async save(permission: Permission): Promise<void> {
    await this.permissionRepository.save(permission);
  }

  findByRoles(): Promise<Permission[]> {
    return Promise.resolve([]);
  }

  async findByIds(ids: string[]): Promise<Permission[] | []> {
    const permissions = await this.permissionRepository.find({
      where: { id: In(ids) },
    });
    return permissions.map((permission: OrmPermission) =>
      PermissionMapper.toDomain(permission),
    );
  }
}
