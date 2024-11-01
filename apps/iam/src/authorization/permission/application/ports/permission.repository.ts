import { Permission } from '../../domain/permission';

export abstract class PermissionRepository {
  abstract save(permission: Permission): Promise<void>;
  abstract findByIds(ids: string[]): Promise<Permission[] | []>;
  abstract findUserPermissions(userId: string): Promise<Permission[]>;
}
