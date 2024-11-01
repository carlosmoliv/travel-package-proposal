import { Column, Entity, ManyToMany, JoinTable } from 'typeorm';

import { OrmBaseEntity } from '@app/common/persistence/orm/entities/orm-base.entity';

import { PermissionEntity } from '../../../permission/infrastructure/orm/permission.entity';
import { RoleName } from '../../domain/enums/role-name.enum';
import { UserEntity } from '../../../../user/infrastructure/persistance/orm/entities/user.entity';

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

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: UserEntity[];
}
