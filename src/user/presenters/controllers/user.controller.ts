import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ActiveUser } from '../../../iam/decorators/active-user';
import { ActiveUserData } from '../../../iam/interfaces/active-user-data.interface';
import { UserService } from '../../application/user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getCurrentUser(@ActiveUser() activeUserData: ActiveUserData) {
    return this.userService.getById(activeUserData.userId);
  }
}
