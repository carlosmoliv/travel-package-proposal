import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

import { Permission, PermissionType } from '../permission.type';
import { PERMISSIONS_KEY } from '../decorators/permissions';
import { ActiveUserData } from '../../interfaces/active-user-data.interface';
import { REQUEST_USER_KEY } from '../../iam.constants';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const contextPermissions = this.reflector.getAllAndOverride<
      PermissionType[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    const activeUserData: ActiveUserData = context.switchToHttp().getRequest()[
      REQUEST_USER_KEY
    ];
    const userPermissions = [
      Permission.CanCreateResource,
      Permission.CanUpdateResource,
    ];
    return contextPermissions.every((permission) =>
      userPermissions.includes(permission),
    );
  }
}
