import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class NotificationEventsService {
	constructor(private readonly prisma: PrismaService) {}

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
}
