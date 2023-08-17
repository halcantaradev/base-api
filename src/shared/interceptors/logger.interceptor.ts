import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { catchError, tap } from 'rxjs';
import { LoggerService } from '../services/logger.service';
import { UserAuth } from '../entities/user-auth.entity';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
	constructor(private readonly loggerService: LoggerService) {}

	async intercept(context: ExecutionContext, next: CallHandler) {
		const request = context.switchToHttp().getRequest();

		const ip = request.ip;
		const body = request.body;
		const query = request.query;
		const method = request.method;
		const route = request.originalUrl;
		const user: UserAuth = request?.user;
		const agent = request.headers['user-agent'];

		return next.handle().pipe(
			tap((data) => {
				const response = context.switchToHttp().getResponse();

				return this.loggerService.send(
					ip,
					agent,
					route,
					method,
					user.id,
					user.empresa_id,
					query,
					body,
					response.statusCode,
					data.message,
				);
			}),
			catchError((err) => {
				return this.loggerService.send(
					ip,
					agent,
					route,
					method,
					user.id,
					user.empresa_id,
					query,
					body,
					err.status,
					err.response.message,
				);
			}),
		);
	}
}
