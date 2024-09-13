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

import { Permissions } from '@app/common/iam/decorators/permissions.decorator';
import { ActiveUserData } from '@app/common/iam/interfaces/active-user-data.interface';

import { UserService } from '../../application/user.service';
import { UserPermission } from '@app/common/iam/enums/user.permissions';
import { AssignRolesToUserDto } from '../dtos/assign-roles-to-user.dto';
import { ActiveUser } from '../../../shared/decorators/active-user';

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
