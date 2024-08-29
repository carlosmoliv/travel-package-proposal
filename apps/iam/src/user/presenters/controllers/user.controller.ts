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

import { UserService } from '../../application/user.service';
import { UserPermission } from '@app/iam-lib/authorization/enums/user.permissions';
import { AssignRolesToUserDto } from '../dtos/assign-roles-to-user.dto';
import { ActiveUserData } from '@app/iam-lib/interfaces/active-user-data.interface';
import { ActiveUser } from '@app/iam-lib/decorators/active-user';
import { Permissions } from '@app/iam-lib/authorization/decorators/permissions';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getCurrentUser(@ActiveUser() activeUserData: ActiveUserData) {
    console.log(activeUserData);
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
