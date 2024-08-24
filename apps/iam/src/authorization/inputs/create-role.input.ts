import { RoleName } from '@app/shared';

export interface CreateRoleInput {
  name: RoleName;
  description?: string;
}
