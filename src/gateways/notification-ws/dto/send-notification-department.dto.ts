import { NotificationWS } from '../entities/notification-ws.entity';

export class SendNotificationDepartmentDto {
	departamento_id: number;
	empresa_id: number;
	notification: NotificationWS;
}
