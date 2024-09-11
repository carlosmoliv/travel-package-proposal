import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { ActiveUserData } from '@app/common/iam/interfaces/active-user-data.interface';
import { REQUEST_USER_KEY } from '@app/common/iam/iam.constants';

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserData, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: ActiveUserData | undefined = request[REQUEST_USER_KEY];
    return field ? user?.[field] : user;
  },
);
