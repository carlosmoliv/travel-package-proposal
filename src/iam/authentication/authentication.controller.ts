import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDto } from './dtos/sign-up.dto';
import { AuthenticationService } from './authentication.service';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('sign-up')
  async signUp(@Body() dto: SignUpDto) {
    await this.authenticationService.signUp({
      email: dto.email,
      name: dto.name,
      password: dto.password,
    });
  }
}
