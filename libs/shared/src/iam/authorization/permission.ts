import { PermissionType } from '@app/shared/iam/authorization/permission.type';

export class Permission {
  constructor(
    public type: PermissionType,
    public description?: string,
    public id?: string,
  ) {}
}
