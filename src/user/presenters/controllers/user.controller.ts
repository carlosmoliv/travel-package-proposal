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
import { Public } from '../../../iam/authentication/application/decorators/public.decorator';
import { AddRolesToUserDto } from '../dtos/add-roles-to-user.dto';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getCurrentUser(@ActiveUser() activeUserData: ActiveUserData) {
    return this.userService.getById(activeUserData.userId);
  }

  @Public()
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
