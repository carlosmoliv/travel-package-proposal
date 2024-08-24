import { Permission } from '@app/shared';

export abstract class PermissionRepository {
  abstract findByRoles(roleIds: string[]): Promise<Permission[] | []>;
  abstract save(permission: Permission): Promise<void>;
  abstract findByIds(ids: string[]): Promise<Permission[] | []>;
}
