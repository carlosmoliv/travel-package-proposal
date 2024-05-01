import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { randomUUID } from 'crypto';

import { SignUpPayload } from './payloads/sign-up.payload';
import { UserRepository } from '../../user/application/ports/user.repository';
import { HashingService } from '../ports/hashing.service';
import { UserFactory } from '../../user/domain/factories/user.factory';
import { SignInPayload } from './payloads/sign-in.payload';
import { TokenService } from '../ports/token.service';
import iamConfig from '../iam.config';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { RefreshTokenData } from '../interfaces/refresh-token-data.interface';
import { User } from '../../user/domain/user';
import { RefreshTokenIdsStorage } from './refresh-token-ids.storage/refresh-token-ids.storage';
import { RefreshTokenPayload } from './payloads/refresh-token';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashingService: HashingService,
    private readonly userFactory: UserFactory,
    private readonly tokenService: TokenService,
    @Inject(iamConfig.KEY)
    private readonly iamConfiguration: ConfigType<typeof iamConfig>,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {}

  async signUp(payload: SignUpPayload): Promise<void> {
    const { name, email, password } = payload;
    const userExists = await this.userRepository.findByCriteria({ email });
    if (userExists) throw new ConflictException();
    const hashedPassword = await this.hashingService.hash(password);
    const user = this.userFactory.create(name, email, hashedPassword);
    await this.userRepository.save(user);
  }

  async signIn(payload: SignInPayload) {
    const user = await this.userRepository.findByCriteria({
      email: payload.email,
    });
    if (!user) throw new UnauthorizedException('User does not exists.');
    const passwordMatch = await this.hashingService.compare(
      payload.password,
      user.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Password does not match.');
    }
    return this.generateTokens(user);
  }

  async refreshTokens(refreshTokenPayload: RefreshTokenPayload) {
    const { userId } = await this.tokenService.validate<RefreshTokenData>(
      refreshTokenPayload.refreshToken,
    );
    const user = await this.userRepository.findByCriteria({ id: userId });
    if (!user) throw new UnauthorizedException();
    return this.generateTokens(user);
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
