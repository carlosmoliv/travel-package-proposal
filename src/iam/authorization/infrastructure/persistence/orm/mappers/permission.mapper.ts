import { Permission } from '../../../../domain/permission';
import { OrmPermission } from '../entities/orm-permission.entity';

export class PermissionMapper {
  static toDomain(ormPermission: OrmPermission) {
    const { id, type, description } = ormPermission;
    const permission = new Permission(type, description, id);
    return permission;
  }
}
