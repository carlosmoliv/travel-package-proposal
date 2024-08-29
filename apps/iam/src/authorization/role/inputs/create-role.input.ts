import { RoleName } from '../../enums/role-name.enum';

export interface CreateRoleInput {
  name: RoleName;
  description?: string;
}
