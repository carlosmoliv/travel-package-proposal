import { MatchesProperty } from '../../../common/decorators/validation/matches-property';

export class SignUpDto {
  name: string;

  email: string;

  password: string;

  @MatchesProperty('password', { message: 'Passwords do not match.' })
  confirmPassword: string;
}
