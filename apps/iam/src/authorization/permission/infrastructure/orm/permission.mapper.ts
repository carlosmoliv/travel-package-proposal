import { Permission } from '../../domain/permission';
import { PermissionEntity } from './permission.entity';

export class PermissionMapper {
  static toDomain(ormPermission: PermissionEntity) {
    const { id, type, description } = ormPermission;
    return new Permission(type, description, id);
  }
}
