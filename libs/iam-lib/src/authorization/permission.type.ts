import { ExamplePermission } from '@app/iam-lib/authorization/enums/example-permission.enum';
import { UserPermission } from '@app/iam-lib/authorization/enums/user.permissions';
import { RolePermission } from '@app/iam-lib/authorization/enums/role.permissions';

export type PermissionType =
  | ExamplePermission
  | UserPermission
  | RolePermission;
