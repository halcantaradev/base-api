import { Controller } from '@nestjs/common';
import { NotificationWSGateway } from './notification-ws.gateway';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SendNotificationUserDto } from './dto/send-notification-user.dto';
import { SendNotificationDepartmentDto } from './dto/send-notification-department.dto';

@Controller('notification-events')
export class NotificationWSController {
	constructor(
		private readonly notificationWSGateway: NotificationWSGateway,
	) {}

	@MessagePattern('user')
	sendNotificationByUser(
		@Payload() sendNotificationUserDto: SendNotificationUserDto,
	) {
		this.notificationWSGateway.sendNotificationByUser(
			sendNotificationUserDto,
		);
	}

	@MessagePattern('department')
	sendNotificationByDepartment(
		@Payload() sendNotificationDepartmentDto: SendNotificationDepartmentDto,
	) {
		this.notificationWSGateway.sendNotificationByDepartment(
			sendNotificationDepartmentDto,
		);
	}

	@MessagePattern('synchronism')
	sendNotificationSync(@Payload() data: any) {
		this.notificationWSGateway.sendNotificationSync(data);
	}
}
