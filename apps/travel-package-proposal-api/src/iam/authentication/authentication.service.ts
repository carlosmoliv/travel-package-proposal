import { randomUUID } from 'crypto';

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { SignUpInput } from './inputs/sign-up.input';
import { SignInInput } from './inputs/sign-in.input';
import { TokenService } from '../ports/token.service';
import iamConfig from '../iam.config';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { RefreshTokenData } from '../interfaces/refresh-token-data.interface';
import { User } from '../../user/domain/user';
import { RefreshTokenIdsStorage } from './refresh-token-ids/refresh-token-ids.storage';
import { RefreshTokenInput } from './inputs/refresh-token.input';
import { InvalidateRefreshTokenError } from './refresh-token-ids/invalidate-refresh-token.error';
import { UserService } from '../../user/application/user.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    @Inject(iamConfig.KEY)
    private readonly iamConfiguration: ConfigType<typeof iamConfig>,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {}

  async signUp(signUpInput: SignUpInput): Promise<void> {
    await this.userService.create(signUpInput);
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
        this.iamConfiguration.accessTokenTtl,
      ),
      this.tokenService.generate<RefreshTokenData>(
        { userId: id, refreshTokenId },
        this.iamConfiguration.refreshTokenTtl,
      ),
    ]);

    await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);

    return { accessToken, refreshToken };
  }
}
