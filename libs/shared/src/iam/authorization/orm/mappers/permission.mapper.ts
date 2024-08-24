import { Permission } from '@app/shared/iam/authorization/permission';
import { OrmPermission } from '@app/shared/iam/authorization/orm/entities/orm-permission.entity';

export class PermissionMapper {
  static toDomain(ormPermission: OrmPermission) {
    const { id, type, description } = ormPermission;
    return new Permission(type, description, id);
  }
}
