import { Permission } from '../permission';

export abstract class PermissionsRepository {
  abstract findByRoles(roleIds: string[]): Promise<Permission[]>;
}
