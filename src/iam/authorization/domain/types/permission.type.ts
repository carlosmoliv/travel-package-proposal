import { UserPermission } from '../../../../user/user.permissions';
import { RolePermission } from '../../role.permissions';
import { ExamplePermission } from '../enums/example-permission.enum';

export type PermissionType =
  | ExamplePermission
  | UserPermission
  | RolePermission;
