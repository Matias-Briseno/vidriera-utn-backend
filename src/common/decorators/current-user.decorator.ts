import {
  createParamDecorator,
  ExecutionContext,
} from "@nestjs/common";

import { AuthenticatedUser } from "../../modules/auth/interfaces/authenticated-user.interface.js";

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);