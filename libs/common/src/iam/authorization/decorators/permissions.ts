import { SetMetadata } from '@nestjs/common';

import { PermissionType } from '../../../../../../apps/iam/src/authorization/permission.type';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: PermissionType[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
