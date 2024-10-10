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
import { MessagePattern } from '@nestjs/microservices';

import { Permissions } from '@app/common/iam/decorators/permissions.decorator';
import { ActiveUserData } from '@app/common/iam/interfaces/active-user-data.interface';
import { UserPermission } from '@app/common/iam/enums/user.permissions';

import { UserService } from '../../application/user.service';
import { AssignRolesToUserDto } from '../dtos/assign-roles-to-user.dto';
import { ActiveUser } from '../../../shared/decorators/active-user';

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

  @MessagePattern('user.checkIfExists')
  async checkIfExists({ userId }: { userId: string }): Promise<boolean> {
    const user = await this.userService.findById(userId);
    return !!user;
  }
}
