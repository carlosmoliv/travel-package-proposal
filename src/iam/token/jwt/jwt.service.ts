import { Inject, Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { TokenService } from '../../ports/token.service';

import jwtConfig from './config/jwt.config';

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
      audience: this.jwtConfiguration.audience,
      issuer: this.jwtConfiguration.issuer,
      secret: this.jwtConfiguration.secret,
      expiresIn: expirationInSeconds,
    });
  }
}
