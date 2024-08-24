import { PermissionType } from '@app/shared/iam/authorization/permission.type';

export interface CreatePermissionInput {
  type: PermissionType;
  description?: string;
}
