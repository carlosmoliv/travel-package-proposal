import { Permission } from '../../domain/permission';
import { OrmPermission } from './orm-permission.entity';

export class PermissionMapper {
  static toDomain(ormPermission: OrmPermission) {
    const { id, type, description } = ormPermission;
    return new Permission(type, description, id);
  }
}
