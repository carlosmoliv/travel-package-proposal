import { IsEnum } from 'class-validator';

import { RoleName } from '../../domain/enums/role-name.enum';

export class CreateRoleDto {
  @IsEnum(RoleName)
  name: RoleName;
  description?: string;
}
