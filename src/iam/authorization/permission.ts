import { PermissionType } from './permission.type';

export class Permission {
  public id: string;

  constructor(
    public type: PermissionType,
    public description?: string,
  ) {}
}
