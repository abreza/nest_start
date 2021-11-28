import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export interface CurrentUserOptions {
  required?: boolean;
}

export const CurrentUser: (options?: CurrentUserOptions) => ParameterDecorator =
  createParamDecorator(
    (options: CurrentUserOptions = {}, ctx: ExecutionContext) => {
      const req = ctx.switchToHttp().getRequest();
      const user = req.user;
      if (options.required && !user) {
        throw new UnauthorizedException();
      }
      return user;
    },
  );
