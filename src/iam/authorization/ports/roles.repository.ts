import { Role } from '../role';

export abstract class RolesRepository {
  abstract save(role: Role): Promise<void>;
}
