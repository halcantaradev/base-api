import { Controller } from '@nestjs/common';
import { NotificationWSGateway } from './notification-ws.gateway';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationWS } from './entities/notification-ws.entity';

@Controller('notification-events')
export class NotificationWSController {
	constructor(
		private readonly notificationWSGateway: NotificationWSGateway,
	) {}

	@MessagePattern('send')
	sendNotification(@Payload() data: NotificationWS) {
		this.notificationWSGateway.sendMessage(data);
	}
}
