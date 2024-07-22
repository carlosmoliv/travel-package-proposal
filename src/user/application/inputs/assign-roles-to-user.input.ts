import { RoleName } from '../../../iam/authorization/domain/enums/role-name.enum';

export interface AssignRolesToUserInput {
  userId: string;
  roleNames: RoleName[];
}
