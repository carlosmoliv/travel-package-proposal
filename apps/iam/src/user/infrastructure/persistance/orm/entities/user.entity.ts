import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { OrmBaseEntity } from '@app/common/persistence/orm/entities/orm-base.entity';

import { RoleEntity } from '../../../../../authorization/role/infrastructure/orm/role.entity';

@Entity('users')
export class UserEntity extends OrmBaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToMany(() => RoleEntity, (role) => role.users)
  @JoinTable({ name: 'user_roles' })
  roles: RoleEntity[];
}
