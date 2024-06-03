import { Permission } from '../../domain/permission';

export abstract class PermissionsRepository {
  abstract findByRoles(roleIds: string[]): Promise<Permission[]>;
  abstract save(permission: Permission): Promise<void>;
}
