import { RoleName } from '../role-name.enum';

export interface CreateRoleInput {
  name: RoleName;
  description?: string;
}
