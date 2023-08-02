import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserAuth } from 'src/shared/entities/user-auth.entity';

export const CurrentUser = createParamDecorator(
	(data: unknown, context: ExecutionContext): UserAuth => {
		const request = context.switchToHttp().getRequest();

		return request.user;
	},
);
