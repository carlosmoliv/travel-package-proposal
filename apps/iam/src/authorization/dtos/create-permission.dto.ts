import { IsEnum, MaxLength } from 'class-validator';

import { PermissionType } from '@app/shared/iam/authorization/permission.type';
import { ExamplePermission } from '@app/shared/iam/authorization/enums/example-permission.enum';

export class CreatePermissionDto {
  @IsEnum(ExamplePermission)
  type: PermissionType;

  @MaxLength(100)
  description?: string;
}
