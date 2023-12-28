import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { FilaService } from './fila/fila.service';
import { UserAuth } from '../entities/user-auth.entity';

@Injectable()
export class LoggerService {
	private readonly logger = new Logger(LoggerService.name);
	constructor(private readonly filaService: FilaService) {}

	async send(
		request: any,
		responseStatus: number,
		responseMessage: string | string[] | undefined,
	): Promise<boolean> {
		try {
			const user: UserAuth = request?.usuario;

			const ip = request.ip;
			const body = request.body;
			const userId = user ? user.id : null;
			const empresaId = user ? user.empresa_id : null;
			const query = request.query;
			const param = request.params;
			const method = request.method;
			const route = request.route.path;
			const agent = request.headers['user-agent'];

			const queueBody = {
				user: {
					ip,
					id: userId,
					empresaId,
				},
				request: {
					route,
					agent,
					method,
					query,
					param,
					body,
				},
				reponse: {
					status: responseStatus,
					message: responseMessage,
				},
				datetime: new Date(),
			};

			this.logger.log(
				`Request {${route}, ${method}} status: ${responseStatus}`,
			);

			await firstValueFrom(this.filaService.publishLog('', queueBody));

			return true;
		} catch {
			return false;
		}
	}
}
