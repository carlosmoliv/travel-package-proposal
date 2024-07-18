import { faker } from '@faker-js/faker';
import { SignUpDto } from '../../../src/iam/authentication/presenters/dtos/sign-up.dto';

export const fakeSignUpDto = (): SignUpDto => {
  const password = faker.internet.password({ prefix: '!Aa0' });
  return {
    email: faker.internet.email(),
    name: faker.internet.userName(),
    password,
    confirmPassword: password,
  };
};
