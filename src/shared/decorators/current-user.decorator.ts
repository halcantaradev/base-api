/* eslint-disable prettier/prettier */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserAuth } from 'src/modules/auth/entities/user-auth.entity';

export const CurrentUser = createParamDecorator(
    (data: unknown, context: ExecutionContext): UserAuth => {
        const request = context.switchToHttp().getRequest();
        return request.user;
    },
);
