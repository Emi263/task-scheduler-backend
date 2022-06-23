import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    //you might use ws, or other protocols
    const request: Express.Request = ctx.switchToHttp().getRequest();

    //user from auth guard
    return request.user;
  },
);
