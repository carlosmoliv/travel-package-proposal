import { IsEmail, IsStrongPassword, MinLength } from 'class-validator';

import { MatchesProperty } from '../../../../common/decorators/validation/matches-property';

export class SignUpDto {
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  @MinLength(8)
  password: string;

  @MatchesProperty('password', { message: 'Passwords do not match.' })
  confirmPassword: string;
}
