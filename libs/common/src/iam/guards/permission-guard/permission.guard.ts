import { lastValueFrom } from 'rxjs';

import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';

import { PERMISSIONS_KEY } from '@app/common/iam/decorators/permissions.decorator';
import { IAM_SERVICE } from '@app/common/constants';

import { PermissionType } from '../../permission.type';
import { REQUEST_USER_KEY } from '../../iam.constants';
import { ActiveUserData } from '../../interfaces/active-user-data.interface';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(IAM_SERVICE)
    private readonly iamService: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextPermissions = this.reflector.getAllAndOverride<
      PermissionType[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!contextPermissions) return true;

    const activeUserData: ActiveUserData = context.switchToHttp().getRequest()[
      REQUEST_USER_KEY
    ];

    const isAuthorized = await lastValueFrom(
      this.iamService.send('user.hasPermissions', {
        userId: activeUserData.userId,
        requiredPermissions: contextPermissions,
      }),
    );

    return isAuthorized;
  }
}
