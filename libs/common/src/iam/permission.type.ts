import { TravelPackagePermission } from '@app/common/iam/enums/travel-package.permissions.enum';

import { ExamplePermission } from '../../../../apps/iam/src/authorization/permission/domain/enums/example-permission.enum';
import { UserPermission } from '../../../../apps/iam/src/user/domain/enums/user.permissions';
import { RolePermission } from '../../../../apps/iam/src/authorization/role/domain/enums/role.permissions';

export type PermissionType =
  | ExamplePermission
  | UserPermission
  | RolePermission
  | TravelPackagePermission;
