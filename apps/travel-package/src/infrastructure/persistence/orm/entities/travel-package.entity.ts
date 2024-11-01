import { Column, Entity } from 'typeorm';

import { BaseEntity } from '@app/common/persistence/orm/entities/base.entity';

@Entity('travel-packages')
export class TravelPackageEntity extends BaseEntity {
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
