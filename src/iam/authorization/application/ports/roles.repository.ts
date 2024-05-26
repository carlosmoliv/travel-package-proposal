import { Role } from '../../domain/role';

export abstract class RolesRepository {
  abstract save(role: Role): Promise<void>;
}
