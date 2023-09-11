import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { NotificationWsService } from 'src/shared/services/notification-ws.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreateNotificationEventDto } from './dto/create-notification-event.dto';

@Injectable()
export class NotificationEventsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly notificationWsService: NotificationWsService,
	) {}

	select: Prisma.NotificacaoSocketSelect = {
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

		return this.prisma.notificacaoSocket.findMany({
			select: this.select,
			where: {
				sala,
				created_at: {
					lt: new Date(),
				},
			},
			orderBy: {
				created_at: 'desc',
			},
		});
	}

	sendNotification(createNotificationEventDto: CreateNotificationEventDto) {
		return this.notificationWsService.send({
			usuario_id: createNotificationEventDto.usuario_id,
			empresa_id: createNotificationEventDto.empresa_id,
			titulo: createNotificationEventDto.titulo,
			conteudo: createNotificationEventDto.conteudo,
			rota: createNotificationEventDto.rota,
		});
	}
}
