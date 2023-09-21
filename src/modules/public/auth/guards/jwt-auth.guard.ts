import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoggerService } from 'src/shared/services/logger.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(private loggerService: LoggerService) {
		super();
	}

	handleRequest(err: any, user: any, info: any, context: any, status: any) {
		if (info instanceof Error) {
			const request = context.switchToHttp().getRequest();

			this.loggerService.send(
				request,
				401,
				'Você não está logado, faça login novamente!',
			);

			throw new UnauthorizedException(
				'Você não está logado, faça login novamente!',
			);
		}

		return super.handleRequest(err, user, info, context, status);
	}
}
