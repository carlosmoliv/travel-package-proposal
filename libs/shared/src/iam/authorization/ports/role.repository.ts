import { Role } from '@app/shared/iam/authorization/role';
import { RoleName } from '@app/shared';

export abstract class RoleRepository {
  abstract save(role: Role): Promise<Role>;
  abstract findById(id: string): Promise<Role>;
  abstract findByIds(id: string[]): Promise<Role[]>;
  abstract findByNames(roleNames: RoleName[]): Promise<Role[]>;
}
