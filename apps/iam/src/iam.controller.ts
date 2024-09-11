import { Controller } from '@nestjs/common';
import { TokenService } from './shared/token/token.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class IamController {
  constructor(private readonly tokenService: TokenService) {}

  @MessagePattern('validate.token')
  async validateToken({ token }: { token: string }) {
    return this.tokenService.validateAndDecode(token);
  }
}
