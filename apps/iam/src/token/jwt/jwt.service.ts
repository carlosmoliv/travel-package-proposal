import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { TokenService } from '../token.service';

@Injectable()
export class JwtService implements TokenService {
  constructor(
    private readonly nestJwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  async generate<T extends Buffer | object>(
    payload: T,
    expirationInSeconds: number,
  ): Promise<string> {
    return this.nestJwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      audience: this.configService.get('JWT_TOKEN_AUDIENCE'),
      issuer: this.configService.get('JWT_TOKEN_ISSUER'),
      expiresIn: expirationInSeconds,
    });
  }

  async validateAndDecode<T extends Buffer | object>(
    token: string,
  ): Promise<T> {
    return this.nestJwtService.verifyAsync(token, {
      secret: this.configService.get('JWT_SECRET'),
      audience: this.configService.get('JWT_TOKEN_AUDIENCE'),
      issuer: this.configService.get('JWT_TOKEN_ISSUER'),
    });
  }
}
