import { Column, Entity, ManyToMany, JoinTable } from 'typeorm';

import { OrmBaseEntity } from '@app/common/persistence/orm/entities/orm-base.entity';

import { OrmPermission } from '../../../permission/infrastructure/orm/orm-permission.entity';
import { RoleName } from '../../domain/enums/role-name.enum';
import { OrmUser } from '../../../../user/infrastructure/persistance/orm/entities/orm-user.entity';

@Entity('roles')
export class RoleEntity extends OrmBaseEntity {
  @Column({ unique: true })
  name: RoleName;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => OrmPermission, (permission) => permission.roles, {
    cascade: true,
  })
  @JoinTable({ name: 'role_permissions' })
  permissions: OrmPermission[];

  @ManyToMany(() => OrmUser, (user) => user.roles)
  users: OrmUser[];
}
