import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PermissionType } from '../permission.type';
import { PERMISSIONS_KEY } from '../decorators/permissions';
import { ActiveUserData } from '../../interfaces/active-user-data.interface';
import { REQUEST_USER_KEY } from '../../iam.constants';
import { UserService } from '../../../user/application/user.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextPermissions = this.reflector.getAllAndOverride<
      PermissionType[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
    if (!contextPermissions) return true;
    const activeUserData: ActiveUserData = context.switchToHttp().getRequest()[
      REQUEST_USER_KEY
    ];
    const userPermissions = await this.userService.getPermissionTypes(
      activeUserData.userId,
    );
    return contextPermissions.every((contextPermission) =>
      userPermissions.includes(contextPermission),
    );
  }
}
