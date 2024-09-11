import { lastValueFrom } from 'rxjs';

import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { PermissionType } from '../permission.type';
import { PERMISSIONS_KEY } from '@app/common/iam/authorization/decorators/permissions';
import { ActiveUserData } from '../../shared/interfaces/active-user-data.interface';
import { REQUEST_USER_KEY } from '../../shared/iam.constants';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextPermissions = this.reflector.getAllAndOverride<
      PermissionType[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
    if (!contextPermissions) return true;
    const activeUserData: ActiveUserData = context.switchToHttp().getRequest()[
      REQUEST_USER_KEY
    ];

    const userPermissions = await lastValueFrom(
      this.userService.send('user.get.permissions', activeUserData.userId),
    );

    return contextPermissions.every((contextPermission) =>
      userPermissions.includes(contextPermission),
    );
  }
}
