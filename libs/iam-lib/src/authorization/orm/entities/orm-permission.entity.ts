import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PermissionType } from '@app/iam-lib/authorization/permission.type';
import { OrmBaseEntity } from '@app/common/infrastructure/persistence/orm/entities/orm-base.entity';

@Entity('permissions')
export class OrmPermission extends OrmBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  type: PermissionType;

  @Column({ nullable: true })
  description: string;
}
