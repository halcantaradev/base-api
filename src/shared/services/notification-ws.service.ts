import { Injectable } from '@nestjs/common';
import { AxiosHeaders } from 'axios';
import { FilaService } from './fila/fila.service';
import { NotificationWS } from 'src/gateways/notification-ws/entities/notification-ws.entity';

@Injectable()
export class NotificationWsService {
	headers: AxiosHeaders;
	baseURL: string;
	constructor(private readonly filaService: FilaService) {}

	send(notification: NotificationWS): Promise<boolean> {
		return new Promise((res, rej) => {
			this.filaService
				.publishNotification('send', notification)
				.then(() => res(true))
				.catch((err) => rej(err));
		});
	}
}
