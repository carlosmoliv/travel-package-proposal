import { PermissionType } from './types/permission.type';

export class Permission {
  constructor(
    public type: PermissionType,
    public description?: string,
    public id?: string,
  ) {}
}
