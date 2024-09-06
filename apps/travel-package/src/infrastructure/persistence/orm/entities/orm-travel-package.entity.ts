import { Column, Entity } from 'typeorm';

import { OrmBaseEntity } from '@app/common/persistence/orm/entities/orm-base.entity';

@Entity('travel-packages')
export class OrmTravelPackage extends OrmBaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  destination: string;

  @Column()
  duration: number;

  @Column('decimal')
  price: number;

  @Column()
  imageUrl: string;
}
