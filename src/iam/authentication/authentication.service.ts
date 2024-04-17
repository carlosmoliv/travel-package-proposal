import { Injectable } from '@nestjs/common';
import { SignUpPayload } from './payloads/sign-up.payload';
import { UserRepository } from '../../user/application/ports/user.repository';
import { HashingService } from '../ports/hashing.service';
import { UserFactory } from '../../user/domain/factories/user.factory';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashingService: HashingService,
    private readonly userFactory: UserFactory,
  ) {}

  async signUp(payload: SignUpPayload): Promise<void> {
    const hashedPassword = await this.hashingService.hash(payload.password);
    const user = this.userFactory.create(
      payload.name,
      payload.email,
      hashedPassword,
    );
    await this.userRepository.save(user);
  }
}
