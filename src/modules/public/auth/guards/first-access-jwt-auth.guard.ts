import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { LoggerService } from 'src/shared/services/logger.service';

@Injectable()
export class FirstAccessJwtAuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private loggerService: LoggerService,
	) {}

	canActivate(
		context: ExecutionContext,
	): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
		const request = context.switchToHttp().getRequest();

		try {
			const tokenPayload = request.headers.authorization;

			const [method, token] = tokenPayload.split(' ');

			if (method !== 'Bearer' || !token) {
				throw new UnauthorizedException(
					'Método de autenticação inválido',
				);
			}

			const data = this.jwtService.verify(token, {
				secret: process.env.SECRET,
			});

			request.user = {
				id: data.sub,
				primeiro_acesso: data.primeiro_acesso,
			};

			return true;
		} catch (ex) {
			this.loggerService.send(request, 401, 'Token inválido');
			throw new UnauthorizedException('Token inválido');
		}
	}
}
