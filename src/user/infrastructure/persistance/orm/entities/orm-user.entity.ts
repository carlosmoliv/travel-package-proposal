import { Column, Entity, JoinTable, ManyToMany, OneToOne } from 'typeorm';

import { OrmRole } from '../../../../../iam/authorization/infrastructure/persistence/orm/entities/orm-role.entity';
import { OrmBaseEntity } from '../../../../../shared/infrastructure/persistence/orm/entities/orm-base.entity';
import { OrmClient } from '../../../../../client/infrastructure/persitence/orm/entities/orm-client.entity';

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

  @OneToOne(() => OrmClient, (client) => client.user)
  client?: OrmClient;
}
