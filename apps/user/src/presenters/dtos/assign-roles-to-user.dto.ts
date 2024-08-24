import { IsArray, IsEnum } from 'class-validator';

import { RoleName } from '@app/shared';

export class AssignRolesToUserDto {
  @IsArray()
  @IsEnum(RoleName, { each: true })
  roleNames: RoleName[];
}
