import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtWSAuthGuard } from './guards/jwt-ws-auth.guard';
import { NotificationWSService } from './notification.service';
import {
	WebSocketServer,
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayConnection,
	OnGatewayDisconnect,
	MessageBody,
	ConnectedSocket,
} from '@nestjs/websockets';
import { NotificationWS } from './entities/notification-ws.entity';

@UseGuards(JwtWSAuthGuard)
@WebSocketGateway(8988, {
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

	sendMessage(message: NotificationWS) {
		this.notificationWSService.sendMessage(this.server, message);
	}
}
