import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { FilaService } from './fila/fila.service';

@Injectable()
export class LoggerService {
	constructor(private readonly filaService: FilaService) {}

	async send(
		ip: string,
		agent: string,
		route: string,
		method: string,
		userId: number,
		empresaId: number,
		query: object = {},
		param: object = {},
		body: object = {},
		responseStatus: number,
		responseMessage: string | string[] | undefined,
	): Promise<boolean> {
		try {
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

			console.log(
				`[${new Date().toLocaleString()}] ${method} ${route} ${responseStatus}`,
			);

			await firstValueFrom(this.filaService.publishLog('', queueBody));

			return true;
		} catch {
			return false;
		}
	}
}
