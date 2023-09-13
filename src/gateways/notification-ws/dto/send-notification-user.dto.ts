import { NotificationWS } from '../entities/notification-ws.entity';

export class SendNotificationUserDto {
	usuario_id: number;
	empresa_id: number;
	notification: NotificationWS;
}
