import { OrmUser } from '../entities/orm-user.entity';
import { User } from '../../../../domain/entities/user.entity';

export class UserMapper {
  static toDomain(ormUser: OrmUser): User {
    const user = new User();
    user.name = ormUser.name;
    user.email = ormUser.email;
    user.password = ormUser.password;
    return user;
  }
}
