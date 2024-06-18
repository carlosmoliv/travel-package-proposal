import { IsArray } from 'class-validator';

export class AddRolesToUserDto {
  @IsArray()
  roleIds: string[];
}
