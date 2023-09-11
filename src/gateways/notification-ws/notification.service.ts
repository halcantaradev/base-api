import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/shared/services/prisma.service';
import { NotificationWS } from './entities/notification-ws.entity';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class NotificationWSService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly jwtService: JwtService,
	) {}

	private async getClientRoom(socket_id: string): Promise<string> {
		const conexao = await this.prisma.conexaoSocket.findFirst({
			select: {
				sala: true,
			},
			where: {
				socket_id,
			},
		});

		return conexao.sala;
	}

	async onConnect(client: Socket) {
		try {
			const decoded = this.jwtService.verify(
				client.handshake.headers.authorization?.split(' ')[1],
				{
					secret: process.env.SECRET,
				},
			);

			const payload: UserAuth = {
				...decoded,
				id: decoded.sub,
			};

			const sala = `${payload.id}-${payload.empresa_id}`;

			await this.prisma.conexaoSocket.create({
				data: {
					socket_id: client.id,
					usuario_id: payload.id,
					empresa_id: payload.empresa_id,
					data_conexao: new Date(),
					sala: sala,
				},
			});

			client.join(sala);
		} catch {
			client.disconnect();
		}
	}

	onDisconnect(client_id: string) {
		this.prisma.conexaoSocket.update({
			data: {
				status: 3,
				data_desconexao: new Date(),
			},
			where: {
				socket_id: client_id,
			},
		});
	}

	async onRead(client: Socket, notification_id: number) {
		try {
			const sala = await this.getClientRoom(client.id);

			if (!notification_id || Number.isNaN(notification_id))
				throw new WsException('Notificação não encontrada');

			const notification = await this.prisma.notificacaoSocket.findFirst({
				where: {
					id: notification_id,
					sala: sala,
				},
			});

			if (!notification)
				throw new WsException('Notificação não encontrada');

			await this.prisma.notificacaoSocket.update({
				data: {
					lida: true,
				},
				where: {
					id: notification_id,
				},
			});

			client.emit('confirmRead', {
				message: 'Marcado como lido',
			});
		} catch (err) {
			client.emit('error', {
				message: 'Ocorreu um erro',
			});
		}
	}

	async onReadAll(client: Socket) {
		try {
			const sala = await this.getClientRoom(client.id);

			await this.prisma.notificacaoSocket.updateMany({
				data: {
					lida: true,
				},
				where: {
					sala: sala,
				},
			});

			client.emit('confirmRead', {
				message: 'Marcado como lido',
			});
		} catch {
			client.emit('error', {
				message: 'Ocorreu um erro',
			});
		}
	}

	async sendMessage(server: Server, message: NotificationWS) {
		const sala = `${message.usuario_id}-${message.empresa_id}`;

		const notification = await this.prisma.notificacaoSocket.create({
			data: {
				titulo: message.titulo,
				conteudo: message.conteudo,
				data: message.data,
				rota: message.rota,
				sala: sala,
			},
		});

		server.to(sala).emit('notify', {
			...message,
			id: notification.id,
		});
	}
}
