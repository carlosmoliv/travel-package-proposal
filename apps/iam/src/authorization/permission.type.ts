import { TravelPackagePermission } from '@app/common/iam/authorization/enums/travel-package.permissions.enum';

import { ExamplePermission } from './permission/domain/enums/example-permission.enum';
import { UserPermission } from '../user/domain/enums/user.permissions';
import { RolePermission } from './role/domain/enums/role.permissions';

export type PermissionType =
  | ExamplePermission
  | UserPermission
  | RolePermission
  | TravelPackagePermission;
