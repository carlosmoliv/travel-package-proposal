import { IsArray } from 'class-validator';

export class AddPermissionsToRoleDto {
  @IsArray()
  permissionIds: string[];
}
