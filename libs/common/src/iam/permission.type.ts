import { TravelPackagePermission } from '@app/common/iam/enums/travel-package.permissions.enum';
import { ExamplePermission } from '@app/common/iam/enums/example-permission.enum';
import { UserPermission } from '@app/common/iam/enums/user.permissions';
import { RolePermission } from '@app/common/iam/enums/role.permissions';

export type PermissionType =
  | ExamplePermission
  | UserPermission
  | RolePermission
  | TravelPackagePermission;