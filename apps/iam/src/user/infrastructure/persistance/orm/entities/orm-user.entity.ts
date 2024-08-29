import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { OrmBaseEntity } from '@app/common/persistence/orm/entities/orm-base.entity';
import { OrmRole } from '../../../../../authorization/role/infrastructure/orm/orm-role.entity';

@Entity('users')
export class OrmUser extends OrmBaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToMany(() => OrmRole)
  @JoinTable({
    name: 'user_roles',
  })
  roles?: OrmRole[];
}
