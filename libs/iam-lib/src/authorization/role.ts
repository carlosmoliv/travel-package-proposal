import { RoleName } from '@app/iam-lib/authorization/enums/role-name.enum';
import { Permission } from '@app/iam-lib/authorization/permission';

export class Role {
  public id: string;
  public permissions: Permission[];

  constructor(
    public name: RoleName,
    public description?: string,
  ) {}
}
