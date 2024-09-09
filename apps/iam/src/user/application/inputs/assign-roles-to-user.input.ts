import { RoleName } from '../../../authorization/role/domain/enums/role-name.enum';

export interface AssignRolesToUserInput {
  userId: string;
  roleNames: RoleName[];
}
