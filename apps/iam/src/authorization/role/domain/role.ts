import { RoleName } from '../../enums/role-name.enum';
import { Permission } from '../../permission/domain/permission';

export class Role {
  public id: string;
  public permissions: Permission[];

  constructor(
    public name: RoleName,
    public description?: string,
  ) {}
}
