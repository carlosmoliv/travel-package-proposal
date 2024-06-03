import { PermissionType } from '../../domain/types/permission.type';

export interface CreatePermissionInput {
  type: PermissionType;
  description?: string;
}
