import { UserPermission } from '../../user/user.permissions';
import { RolePermission } from './role.permissions';
import { ExamplePermission } from './enums/example-permission.enum';
import { TravelPackagePermission } from '../../travel-package/travel-package.permissions';

export type PermissionType =
  | ExamplePermission
  | UserPermission
  | RolePermission
  | TravelPackagePermission;
