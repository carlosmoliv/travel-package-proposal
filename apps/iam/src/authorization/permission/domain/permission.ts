import { PermissionType } from '../../permission.type';

export class Permission {
  constructor(
    public type: PermissionType,
    public description?: string,
    public id?: string,
  ) {}
}
