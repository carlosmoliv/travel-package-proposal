import { RoleName } from '@app/iam-lib/authorization/enums/role-name.enum';

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  roleNames?: RoleName[];
}
