import { RoleName } from '../../../user/role-name.enum';

export class CreateRoleInput {
  name: RoleName;
  description?: string;
}
