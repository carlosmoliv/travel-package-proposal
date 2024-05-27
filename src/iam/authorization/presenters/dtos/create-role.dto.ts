import { IsEnum, MaxLength } from 'class-validator';

import { RoleName } from '../../domain/enums/role-name.enum';

export class CreateRoleDto {
  @IsEnum(RoleName)
  name: RoleName;

  @MaxLength(100)
  description?: string;
}
