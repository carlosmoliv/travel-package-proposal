import { Role } from '@app/iam-lib/authorization/role';
import { RoleName } from '@app/iam-lib/authorization/enums/role-name.enum';

export abstract class RoleRepository {
  abstract save(role: Role): Promise<Role>;
  abstract findById(id: string): Promise<Role>;
  abstract findByIds(id: string[]): Promise<Role[]>;
  abstract findByNames(roleNames: RoleName[]): Promise<Role[]>;
}
