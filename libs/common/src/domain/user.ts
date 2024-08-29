import { Role } from '../../../../apps/iam/src/authorization/role';

export class User {
  public name: string;
  public email: string;
  public password: string;
  public roles: Role[];

  constructor(public id: string) {}
}
