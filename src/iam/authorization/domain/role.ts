import { RoleName } from './enums/role-name.enum';

export class Role {
  public id: string;

  constructor(
    public name: RoleName,
    public description?: string,
  ) {}
}
