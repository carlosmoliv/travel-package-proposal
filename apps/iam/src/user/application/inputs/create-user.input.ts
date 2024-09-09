import { RoleName } from '../../../authorization/role/domain/enums/role-name.enum';

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  roleNames?: RoleName[];
}
