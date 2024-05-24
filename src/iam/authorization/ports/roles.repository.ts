import { Role } from '../../../user/domain/role';

export abstract class RolesRepository {
  abstract findRolesByUserId(userId: string): Promise<Role[]>;
}
