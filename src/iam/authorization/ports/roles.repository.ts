import { Role } from '../../../user/domain/role';

export abstract class RolesRepository {
  abstract save(role: Role): Promise<void>;
}
