import { PermissionType } from '@app/common/iam/permission.type';

export interface CreatePermissionInput {
  type: PermissionType;
  description?: string;
}
