import { NotificationWS } from 'src/gateways/notification-ws/entities/notification-ws.entity';

export class SendNotificationEventDepartmentDto {
	departamento_id: number;
	empresa_id: number;
	notification: NotificationWS;
}
