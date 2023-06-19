import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	handleRequest(err: any, user: any, info: any, context: any, status: any) {
		if (info instanceof Error) {
			throw new UnauthorizedException(
				'Você não está logado, faça login novamente!',
			);
		}

		return super.handleRequest(err, user, info, context, status);
	}
}
