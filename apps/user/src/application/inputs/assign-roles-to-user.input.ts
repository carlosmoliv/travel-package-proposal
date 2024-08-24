import { RoleName } from '@app/shared';

export interface AssignRolesToUserInput {
  userId: string;
  roleNames: RoleName[];
}
