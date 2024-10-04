import { Request } from 'express';
import { lastValueFrom } from 'rxjs';

import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';

import { IS_PUBLIC_KEY } from '@app/common/iam/decorators/public.decorator';
import { IAM_SERVICE } from '@app/common/constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    @Inject(IAM_SERVICE) private readonly client: ClientProxy,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException('Token is missing.');
    try {
      request['user'] = await lastValueFrom(
        this.client.send('validate.token', { token }),
      );
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
