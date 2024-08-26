import { Permission } from '@app/iam-lib/authorization/permission';

export abstract class PermissionRepository {
  abstract findByRoles(roleIds: string[]): Promise<Permission[] | []>;
  abstract save(permission: Permission): Promise<void>;
  abstract findByIds(ids: string[]): Promise<Permission[] | []>;
}
