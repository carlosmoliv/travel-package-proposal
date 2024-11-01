import { Column, Entity, ManyToMany, JoinTable } from 'typeorm';

import { OrmBaseEntity } from '@app/common/persistence/orm/entities/orm-base.entity';

import { PermissionEntity } from '../../../permission/infrastructure/orm/permission.entity';
import { RoleName } from '../../domain/enums/role-name.enum';
import { OrmUser } from '../../../../user/infrastructure/persistance/orm/entities/orm-user.entity';

@Entity('roles')
export class RoleEntity extends OrmBaseEntity {
  @Column({ unique: true })
  name: RoleName;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => PermissionEntity, (permission) => permission.roles, {
    cascade: true,
  })
  @JoinTable({ name: 'role_permissions' })
  permissions: PermissionEntity[];

  @ManyToMany(() => OrmUser, (user) => user.roles)
  users: OrmUser[];
}
