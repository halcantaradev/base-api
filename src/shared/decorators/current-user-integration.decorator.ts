import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserIntegration = createParamDecorator(
	(data: unknown, context: ExecutionContext): any => {
		return context.switchToRpc().getData().user;
	},
);
