import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { SignUpPayload } from './payloads/sign-up.payload';
import { UserRepository } from '../../user/application/ports/user.repository';
import { HashingService } from '../ports/hashing.service';
import { UserFactory } from '../../user/domain/factories/user.factory';
import { SignInPayload } from './payloads/sign-in.payload';
import { TokenService } from '../ports/token.service';
import iamConfig from '../iam.config';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashingService: HashingService,
    private readonly userFactory: UserFactory,
    private readonly tokenService: TokenService,
    @Inject(iamConfig.KEY)
    private readonly iamConfiguration: ConfigType<typeof iamConfig>,
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
    const { email, password } = payload;
    const user = await this.userRepository.findByCriteria({
      email: payload.email,
    });
    if (!user) throw new UnauthorizedException('User does not exists.');
    const passwordMatch = await this.hashingService.compare(
      password,
      user.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Password does not match.');
    }
    const accessToken = await this.tokenService.generate(
      { userId: user.id, email },
      this.iamConfiguration.accessTokenTtl,
    );
    return { accessToken };
  }
}
