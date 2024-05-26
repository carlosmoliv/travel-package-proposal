import { Permission } from '../../domain/permission';

export abstract class PermissionsRepository {
  abstract findByRoles(roleIds: string[]): Promise<Permission[]>;
}
