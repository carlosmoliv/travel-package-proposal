import { RoleName } from '../../../user/role-name.enum';

export interface CreateRoleInput {
  name: RoleName;
  description?: string;
}
