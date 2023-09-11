import { Injectable } from '@nestjs/common';
import { AxiosHeaders } from 'axios';
import { FilaService } from './fila/fila.service';
import { SendNotificationUserDto } from 'src/gateways/notification-ws/dto/send-notification-user.dto';
import { SendNotificationDepartmentDto } from 'src/gateways/notification-ws/dto/send-notification-department.dto';

@Injectable()
export class NotificationWsService {
	headers: AxiosHeaders;
	baseURL: string;
	constructor(private readonly filaService: FilaService) {}

	sendUser(notification: SendNotificationUserDto): Promise<boolean> {
		return new Promise((res, rej) => {
			this.filaService
				.publishNotification('user', notification)
				.then(() => res(true))
				.catch((err) => rej(err));
		});
	}

	sendDepartment(
		notification: SendNotificationDepartmentDto,
	): Promise<boolean> {
		return new Promise((res, rej) => {
			this.filaService
				.publishNotification('department', notification)
				.then(() => res(true))
				.catch((err) => rej(err));
		});
	}
}
