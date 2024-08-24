import { RoleName, Permission } from '@app/shared';

export class Role {
  public id: string;
  public permissions: Permission[];

  constructor(
    public name: RoleName,
    public description?: string,
  ) {}
}
