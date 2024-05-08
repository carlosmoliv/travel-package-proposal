import { Role } from '../../user/domain/role';

export interface ActiveUserData {
  userId: string;
  email: string;
  roles: Role[];
}
