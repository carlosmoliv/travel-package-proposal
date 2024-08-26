import { UserPermission, ExamplePermission, RolePermission } from '@app/shared';

export type PermissionType =
  | ExamplePermission
  | UserPermission
  | RolePermission;
