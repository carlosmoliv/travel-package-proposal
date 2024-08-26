import { PermissionType } from '@app/iam-lib/authorization/permission.type';

export interface CreatePermissionInput {
  type: PermissionType;
  description?: string;
}
