import { Inject, Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { TokenService } from '../../ports/token.service';

import jwtConfig from './jwt.config';

@Injectable()
export class JwtService implements TokenService {
  constructor(
    private readonly nestJwtService: NestJwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async generate<T extends Buffer | object>(
    payload: T,
    expirationInSeconds: number,
  ): Promise<string> {
    return this.nestJwtService.signAsync(payload, {
      ...this.jwtConfiguration,
      expiresIn: expirationInSeconds,
    });
  }

  async validate<T extends Buffer | object>(token: string): Promise<T> {
    return this.nestJwtService.verifyAsync(token, this.jwtConfiguration);
  }
}
