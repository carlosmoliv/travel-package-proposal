import { Permission } from '@app/iam-lib/authorization/permission';
import { OrmPermission } from '@app/iam-lib/authorization/orm/entities/orm-permission.entity';

export class PermissionMapper {
  static toDomain(ormPermission: OrmPermission) {
    const { id, type, description } = ormPermission;
    return new Permission(type, description, id);
  }
}
