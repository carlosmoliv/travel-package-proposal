import { Column, Entity, ManyToMany } from 'typeorm';

import { OrmBaseEntity } from '../../../../../shared/infrastructure/persistence/orm/entities/orm-base.entity';
import { OrmProposal } from '../../../../../proposal/infrastructure/persitence/orm/entities/orm-proposal.entity';

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

  @ManyToMany(() => OrmProposal, (proposal) => proposal.travelPackages)
  proposals: OrmProposal[];
}
