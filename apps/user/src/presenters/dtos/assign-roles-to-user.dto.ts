import { IsArray, IsEnum } from 'class-validator';
import { RoleName } from '@app/iam-lib/authorization/enums/role-name.enum';

export class AssignRolesToUserDto {
  @IsArray()
  @IsEnum(RoleName, { each: true })
  roleNames: RoleName[];
}
