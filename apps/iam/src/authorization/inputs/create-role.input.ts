import { RoleName } from '@app/iam-lib/authorization/enums/role-name.enum';

export interface CreateRoleInput {
  name: RoleName;
  description?: string;
}
