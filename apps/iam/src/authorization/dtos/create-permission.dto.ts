import { IsEnum, MaxLength } from 'class-validator';

import { PermissionType } from '@app/iam-lib/authorization/permission.type';
import { ExamplePermission } from '@app/iam-lib/authorization/enums/example-permission.enum';

export class CreatePermissionDto {
  @IsEnum(ExamplePermission)
  type: PermissionType;

  @MaxLength(100)
  description?: string;
}
