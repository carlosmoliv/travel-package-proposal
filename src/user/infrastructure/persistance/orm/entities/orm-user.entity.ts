import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class OrmUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;
}
