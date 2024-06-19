import { Role } from '../../domain/role';

export abstract class RoleRepository {
  abstract save(role: Role): Promise<void>;
  abstract findById(id: string): Promise<Role>;
  abstract findByIds(id: string[]): Promise<Role[]>;
}
