import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PermissionType } from '../../../permission.type';
import { OrmBaseEntity } from '@app/common/persistence/orm/entities/orm-base.entity';

@Entity('permissions')
export class OrmPermission extends OrmBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  type: PermissionType;

  @Column({ nullable: true })
  description: string;
}
