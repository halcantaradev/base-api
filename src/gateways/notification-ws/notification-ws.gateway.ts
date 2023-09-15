import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtWSAuthGuard } from './guards/jwt-ws-auth.guard';
import { NotificationWSService } from './notification-ws.service';
import {
	WebSocketServer,
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayConnection,
	OnGatewayDisconnect,
	MessageBody,
	ConnectedSocket,
} from '@nestjs/websockets';
import { SendNotificationUserDto } from './dto/send-notification-user.dto';
import { SendNotificationDepartmentDto } from './dto/send-notification-department.dto';

@UseGuards(JwtWSAuthGuard)
@WebSocketGateway(+process.env.SOCKET_PORT, {
	cors: {
		origin: '*',
	},
})
export class NotificationWSGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	private server: Server;

	constructor(
		private readonly notificationWSService: NotificationWSService,
	) {}

	handleConnection(client: Socket) {
		this.notificationWSService.onConnect(client);
	}

	handleDisconnect(client: Socket) {
		this.notificationWSService.onDisconnect(client.id);
	}

	@SubscribeMessage('read')
	readMessage(
		@MessageBody() payload: string,
		@ConnectedSocket() client: Socket,
	) {
		this.notificationWSService.onRead(client, +payload);
	}

	@SubscribeMessage('readAll')
	readAllMessages(client: Socket) {
		this.notificationWSService.onReadAll(client);
	}

	sendNotificationByUser(sendNotificationUserDto: SendNotificationUserDto) {
		this.notificationWSService.sendNotificationByUser(
			this.server,
			sendNotificationUserDto,
		);
	}

	sendNotificationByDepartment(
		sendNotificationDepartmentDto: SendNotificationDepartmentDto,
	) {
		this.notificationWSService.sendNotificationByDepartment(
			this.server,
			sendNotificationDepartmentDto,
		);
	}

	sendNotificationSync(data: any) {
		this.server.emit('sincronismo', data);
	}
}
