import { Injectable } from '@nestjs/common';
import { CreateLayoutsNotificationDto } from './dto/create-layouts-notification.dto';
import { UpdateLayoutsNotificationDto } from './dto/update-layouts-notification.dto';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class LayoutsNotificationService {
	constructor(private readonly prisma: PrismaService) {}
	create(
		createLayoutsNotificationDto: CreateLayoutsNotificationDto,
		empresa_id,
	) {
		return this.prisma.layoutsNotificacao.create({
			data: {
				nome: createLayoutsNotificationDto.nome,
				modelo: createLayoutsNotificationDto.modelo,
				ativo: createLayoutsNotificationDto.ativo,
				empresa_id,
			},
		});
	}

	findAll(empresa_id: number) {
		return this.prisma.layoutsNotificacao.findMany({
			where: { empresa_id },
		});
	}

	findOne(id: number, empresa_id: number) {
		return this.prisma.layoutsNotificacao.findFirst({
			where: { id, empresa_id },
		});
	}

	update(
		id: number,
		updateLayoutsNotificationDto: UpdateLayoutsNotificationDto,
	) {
		return this.prisma.layoutsNotificacao.update({
			data: {
				nome: updateLayoutsNotificationDto.nome,
				modelo: updateLayoutsNotificationDto.modelo,
				ativo: updateLayoutsNotificationDto.ativo,
			},
			where: { id },
		});
	}

	remove(id: number) {
		return `This action removes a #${id} layoutsNotification`;
	}
}
