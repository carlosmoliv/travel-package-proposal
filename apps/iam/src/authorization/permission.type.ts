import { ExamplePermission } from './enums/example-permission.enum';
import { UserPermission } from './enums/user.permissions';
import { RolePermission } from './enums/role.permissions';

export type PermissionType =
  | ExamplePermission
  | UserPermission
  | RolePermission;
