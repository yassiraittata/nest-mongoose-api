import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    console.log("the user ", req.user);

    if (!data) {
      return req.user;
    }
    return req.user[data];
  },
);
