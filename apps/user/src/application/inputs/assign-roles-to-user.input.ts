import { RoleName } from '@app/iam-lib/authorization/enums/role-name.enum';

export interface AssignRolesToUserInput {
  userId: string;
  roleNames: RoleName[];
}
