import { PermissionType } from '@app/iam-lib/authorization/permission.type';

export class Permission {
  constructor(
    public type: PermissionType,
    public description?: string,
    public id?: string,
  ) {}
}
