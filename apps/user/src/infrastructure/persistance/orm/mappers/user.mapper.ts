import { OrmUser } from '../entities/orm-user.entity';
import { User } from '@app/common/domain/user';

export class UserMapper {
  static toDomain(ormUser: OrmUser): User {
    const user = new User(ormUser.id);
    user.name = ormUser.name;
    user.email = ormUser.email;
    user.password = ormUser.password;
    return user;
  }
}
