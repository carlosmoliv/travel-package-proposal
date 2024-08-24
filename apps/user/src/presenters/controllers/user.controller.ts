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

import { ActiveUser, ActiveUserData, Permissions } from '@app/shared';
import { UserService } from '../../application/user.service';
import { UserPermission } from '@app/shared/iam/authorization/enums/user.permissions';
import { AssignRolesToUserDto } from '../dtos/assign-roles-to-user.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

class VerifyUserCredentialsDto {
  email: string;
  password: string;
}

class CreateUserDto {
  name: string;
  email: string;
  password: string;
}

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

  @MessagePattern('user.verify.credentials')
  async verifyUserCredentials(@Payload() data: unknown) {
    const { email, password } = data as VerifyUserCredentialsDto;
    return this.userService.verifyUserCredentials(email, password);
  }

  @MessagePattern('user.create')
  async create(@Payload() data: unknown) {
    await this.userService.create(data as CreateUserDto);
  }

  @MessagePattern('user.findById')
  async findById(@Payload() userId: string) {
    return this.userService.findById(userId);
  }

  @MessagePattern('user.get.permissions')
  async getUserPermissions(@Payload() userId: string) {
    return this.userService.getPermissionTypes(userId);
  }
}
