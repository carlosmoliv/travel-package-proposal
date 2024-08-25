import { randomUUID } from 'crypto';
import { lastValueFrom } from 'rxjs';

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { SignUpInput } from './inputs/sign-up.input';
import { SignInInput } from './inputs/sign-in.input';
import { TokenService } from '@app/shared/iam/ports/token.service';
import { ActiveUserData } from '@app/shared/iam/interfaces/active-user-data.interface';
import { RefreshTokenData } from '../interfaces/refresh-token-data.interface';
import { User } from '@app/shared';
import { RefreshTokenIdsStorage } from './refresh-token-ids/refresh-token-ids.storage';
import { RefreshTokenInput } from './inputs/refresh-token.input';
import { InvalidateRefreshTokenError } from './refresh-token-ids/invalidate-refresh-token.error';
import { ClientProxy } from '@nestjs/microservices';
import { USER_SERVICE } from '../iam.constants';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userService: ClientProxy,
    private readonly tokenService: TokenService,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {}

  async signUp(signUpInput: SignUpInput): Promise<void> {
    const { email, password, name } = signUpInput;
    await lastValueFrom(
      this.userService.send('user.create', { name, email, password }),
    );
  }

  async signIn({ email, password }: SignInInput) {
    const user = await lastValueFrom(
      this.userService.send('user.verify.credentials', { email, password }),
    );
    return this.generateTokens(user);
  }

  async refreshTokens({ refreshToken }: RefreshTokenInput) {
    try {
      const decodedToken =
        await this.tokenService.validateAndDecode<RefreshTokenData>(
          refreshToken,
        );

      const user = await lastValueFrom(
        this.userService.send('user.findById', decodedToken.userId),
      );

      await this.refreshTokenIdsStorage.validate(
        user.id,
        decodedToken.refreshTokenId,
      );
      await this.refreshTokenIdsStorage.invalidate(user.id);

      return this.generateTokens(user);
    } catch (err) {
      if (err instanceof InvalidateRefreshTokenError) {
        throw new UnauthorizedException('Access Denied');
      }
      throw new UnauthorizedException();
    }
  }

  private async generateTokens(user: User) {
    const { id, email } = user;
    const refreshTokenId = randomUUID();

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generate<ActiveUserData>(
        { userId: id, email },
        parseInt(process.env.ACCESS_TOKEN_TTL),
      ),
      this.tokenService.generate<RefreshTokenData>(
        { userId: id, refreshTokenId },
        parseInt(process.env.REFRESH_TOKEN_TTL),
      ),
    ]);

    await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);

    return { accessToken, refreshToken };
  }

  async validateToken(token: string) {
    await this.tokenService.validateAndDecode(token);
  }
}
