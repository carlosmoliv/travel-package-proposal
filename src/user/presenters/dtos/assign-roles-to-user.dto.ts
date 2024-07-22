import { IsArray, IsEnum } from 'class-validator';

import { RoleName } from '../../../iam/authorization/domain/enums/role-name.enum';

export class AssignRolesToUserDto {
  @IsArray()
  @IsEnum(RoleName, { each: true })
  roleNames: RoleName[];
}
