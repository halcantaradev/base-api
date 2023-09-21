import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs';
import { LoggerService } from '../services/logger.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
	constructor(private readonly loggerService: LoggerService) {}

	async intercept(context: ExecutionContext, next: CallHandler) {
		const request = context.switchToHttp().getRequest();
		return next.handle().pipe(
			tap({
				next: (data) => {
					const response = context.switchToHttp().getResponse();

					this.loggerService.send(
						request,
						response.statusCode,
						data.message,
					);
				},
				error: (err) => {
					this.loggerService.send(
						request,
						err?.status || 500,
						err?.response?.message || err,
					);
				},
			}),
		);
	}
}
