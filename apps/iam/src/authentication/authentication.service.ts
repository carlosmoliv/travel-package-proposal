import { randomUUID } from 'crypto';

import { Injectable, UnauthorizedException } from '@nestjs/common';

import { SignUpInput } from './inputs/sign-up.input';
import { SignInInput } from './inputs/sign-in.input';
import { TokenService } from '../shared/token/token.service';
import { ActiveUserData } from '../shared/interfaces/active-user-data.interface';
import { RefreshTokenData } from '../shared/interfaces/refresh-token-data.interface';
import { RefreshTokenIdsStorage } from './refresh-token-ids/refresh-token-ids.storage';
import { RefreshTokenInput } from './inputs/refresh-token.input';
import { InvalidateRefreshTokenError } from './refresh-token-ids/invalidate-refresh-token.error';
import { User } from '../user/domain/user';
import { UserService } from '../user/application/user.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {}

  async signUp(signUpInput: SignUpInput): Promise<void> {
    const { email, password, name } = signUpInput;
    await this.userService.create({ email, password, name });
  }

  async signIn({ email, password }: SignInInput) {
    const user = await this.userService.verifyUserCredentials(email, password);
    return this.generateTokens(user);
  }

  async refreshTokens({ refreshToken }: RefreshTokenInput) {
    try {
      const decodedToken =
        await this.tokenService.validateAndDecode<RefreshTokenData>(
          refreshToken,
        );

      const user = await this.userService.findById(decodedToken.userId);

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
