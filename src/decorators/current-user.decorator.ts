import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const { user } = ctx.switchToHttp().getRequest();

    if (!user) return null;

    return user;
  },
);
