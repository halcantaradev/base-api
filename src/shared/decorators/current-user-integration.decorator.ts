import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const CurrentUserIntegration = createParamDecorator(
	(data: unknown, context: ExecutionContext): any => {
		const token = context.switchToRpc().getData().payload.token;

		return new JwtService().verify(token, {
			secret: process.env.SECRET,
		});
	},
);
