import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs';
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
		const param = request.params;
		const method = request.method;
		const route = request.route.path;
		const user: UserAuth = request?.user;
		const agent = request.headers['user-agent'];

		return next.handle().pipe(
			tap({
				next: (data) => {
					const response = context.switchToHttp().getResponse();

					this.loggerService.send(
						ip,
						agent,
						route,
						method,
						user ? user.id : 0,
						user ? user.empresa_id : 0,
						query,
						param,
						body,
						response.statusCode,
						data.message,
					);
				},
				error: (err) => {
					this.loggerService.send(
						ip,
						agent,
						route,
						method,
						user ? user.id : 0,
						user ? user.empresa_id : 0,
						query,
						param,
						body,
						err?.status || 500,
						err?.response?.message || err,
					);
				},
			}),
		);
	}
}
