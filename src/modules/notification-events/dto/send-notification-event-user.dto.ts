import { NotificationWS } from 'src/gateways/notification-ws/entities/notification-ws.entity';

export class SendNotificationEventUserDto {
	usuario_id: number;
	empresa_id: number;
	notification: NotificationWS;
}
