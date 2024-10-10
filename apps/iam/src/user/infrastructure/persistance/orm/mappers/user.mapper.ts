import { OrmUser } from '../entities/orm-user.entity';
import { User } from '../../../../domain/user';
import { Role } from '../../../../../authorization/role/domain/role';

export class UserMapper {
  static toDomain(ormUser: OrmUser): User {
    const user = new User(ormUser.id);
    user.name = ormUser.name;
    user.email = ormUser.email;
    user.password = ormUser.password;
    if (ormUser.roles && ormUser.roles.length > 0) {
      user.roles = ormUser.roles.map((ormRole) => {
        const role = new Role(ormRole.name, ormRole.description);
        role.id = ormRole.id;
        return role;
      });
    }
    return user;
  }
}
