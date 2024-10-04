import { OrmUser } from '../entities/orm-user.entity';
import { User } from '../../../../domain/user';
import { Role } from '../../../../../authorization/role/domain/role';

export class UserMapper {
  static toDomain(ormUser: OrmUser): User {
    const user = new User(ormUser.id);
    user.name = ormUser.name;
    user.email = ormUser.email;
    user.password = ormUser.password;
    user.roles = ormUser.roles.map(
      (role) => new Role(role.name, role.description),
    );
    return user;
  }
}
