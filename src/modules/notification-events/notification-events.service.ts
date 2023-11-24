import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { NotificationWsService } from 'src/shared/services/notification-ws.service';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { SendNotificationEventUserDto } from './dto/send-notification-event-user.dto';
import { SendNotificationEventDepartmentDto } from './dto/send-notification-event-department.dto';

@Injectable()
export class NotificationEventsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly notificationWsService: NotificationWsService,
	) {}

	select: Prisma.NotificacaoEventoSelect = {
		id: true,
		titulo: true,
		conteudo: true,
		rota: true,
		data: true,
		created_at: true,
		updated_at: true,
		lida: true,
	};

	findAll(user: UserAuth) {
		const sala = `${user.id}-${user.empresa_id}`;

		const dataHoje = new Date();
		const dataLimite = new Date();
		dataLimite.setDate(dataHoje.getDate() - 2);

		return this.prisma.notificacaoEvento.findMany({
			select: this.select,
			where: {
				sala,
				created_at: {
					gt: dataLimite,
				},
			},
			orderBy: {
				created_at: 'desc',
			},
		});
	}

	sendNotificationByUser(
		sendNotificationEventUserDto: SendNotificationEventUserDto,
	) {
		try {
			return this.notificationWsService.sendUser({
				usuario_id: sendNotificationEventUserDto.usuario_id,
				empresa_id: sendNotificationEventUserDto.empresa_id,
				notification: {
					titulo: sendNotificationEventUserDto.notification.titulo,
					conteudo:
						sendNotificationEventUserDto.notification.conteudo,
					rota: sendNotificationEventUserDto.notification.rota,
					data: sendNotificationEventUserDto.notification.data,
				},
			});
		} catch (err) {
			throw new Error('Ocorreu um erro ao enviar a notificação');
		}
	}

	sendNotificationByDepartment(
		sendNotificationEventDepartmentDto: SendNotificationEventDepartmentDto,
	) {
		try {
			return this.notificationWsService.sendDepartment({
				departamento_id:
					sendNotificationEventDepartmentDto.departamento_id,
				empresa_id: sendNotificationEventDepartmentDto.empresa_id,
				notification: {
					titulo: sendNotificationEventDepartmentDto.notification
						.titulo,
					conteudo:
						sendNotificationEventDepartmentDto.notification
							.conteudo,
					rota: sendNotificationEventDepartmentDto.notification.rota,
					data: sendNotificationEventDepartmentDto.notification.data,
				},
			});
		} catch (err) {
			throw new Error('Ocorreu um erro ao enviar a notificação');
		}
	}
}
