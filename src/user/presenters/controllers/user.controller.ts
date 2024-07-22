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
import { Permissions } from '../../../iam/authorization/application/decorators/permissions';
import { UserPermission } from '../../user.permissions';
import { AssignRolesToUserDto } from '../dtos/assign-roles-to-user.dto';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getCurrentUser(@ActiveUser() activeUserData: ActiveUserData) {
    return this.userService.findById(activeUserData.userId);
  }

  @Permissions(UserPermission.AssignRolesToUser)
  @HttpCode(HttpStatus.OK)
  @Post(':userId/roles')
  assignRolesToUser(
    @Param('userId') userId: string,
    @Body() addRolesToUserDto: AssignRolesToUserDto,
  ) {
    return this.userService.assignRolesToUser({
      userId,
      roleNames: addRolesToUserDto.roleNames,
    });
  }
}
