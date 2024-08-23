import { RoleName } from '../../../iam/authorization/enums/role-name.enum';

export interface AssignRolesToUserInput {
  userId: string;
  roleNames: RoleName[];
}
