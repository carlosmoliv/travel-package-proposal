import { RoleName } from '../../domain/enums/role-name.enum';

export interface CreateRoleInput {
  name: RoleName;
  description?: string;
}
