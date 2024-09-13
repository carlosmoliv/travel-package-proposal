import { IsEnum, MaxLength } from 'class-validator';

import { PermissionType } from '@app/common/iam/permission.type';
import { ExamplePermission } from '@app/common/iam/enums/example-permission.enum';

export class CreatePermissionDto {
  @IsEnum(ExamplePermission)
  type: PermissionType;

  @MaxLength(100)
  description?: string;
}
