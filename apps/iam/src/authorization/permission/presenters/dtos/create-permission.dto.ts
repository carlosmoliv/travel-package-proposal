import { IsEnum, MaxLength } from 'class-validator';

import { PermissionType } from '../../../permission.type';
import { ExamplePermission } from '../../../enums/example-permission.enum';

export class CreatePermissionDto {
  @IsEnum(ExamplePermission)
  type: PermissionType;

  @MaxLength(100)
  description?: string;
}
