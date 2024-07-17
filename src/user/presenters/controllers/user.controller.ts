import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ActiveUser } from '../../../iam/decorators/active-user';
import { ActiveUserData } from '../../../iam/interfaces/active-user-data.interface';
import { UserService } from '../../application/user.service';
import { AddRolesToUserDto } from '../dtos/add-roles-to-user.dto';
import { Permissions } from '../../../iam/authorization/application/decorators/permissions';
import { UserPermission } from '../../user.permissions';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getCurrentUser(@ActiveUser() activeUserData: ActiveUserData) {
    return this.userService.getById(activeUserData.userId);
  }

  @Permissions(UserPermission.AddRolesToUser)
  @HttpCode(HttpStatus.OK)
  @Post(':userId/roles')
  addRolesToUser(
    @Param('userId') userId: string,
    @Body() addRolesToUserDto: AddRolesToUserDto,
  ) {
    return this.userService.addRolesToUser({
      userId,
      roleIds: addRolesToUserDto.roleIds,
    });
  }
}
