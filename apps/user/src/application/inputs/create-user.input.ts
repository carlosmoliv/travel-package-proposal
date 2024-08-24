import { RoleName } from '@app/shared';

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  roleNames?: RoleName[];
}
