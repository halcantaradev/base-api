import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserCondominiums = createParamDecorator(
	(data: unknown, context: ExecutionContext): number[] => {
		const request = context.switchToHttp().getRequest();

		return request.condominios;
	},
);
