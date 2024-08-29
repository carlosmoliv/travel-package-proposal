import { PermissionType } from '../../../permission.type';

export interface CreatePermissionInput {
  type: PermissionType;
  description?: string;
}
