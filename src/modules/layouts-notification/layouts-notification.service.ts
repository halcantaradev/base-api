import { Injectable } from '@nestjs/common';
import { CreateLayoutsNotificationDto } from './dto/create-layouts-notification.dto';
import { UpdateLayoutsNotificationDto } from './dto/update-layouts-notification.dto';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class LayoutsNotificationService {
	constructor(private readonly prisma: PrismaService) {}
	async create(
		createLayoutsNotificationDto: CreateLayoutsNotificationDto,
		empresa_id,
	) {
		if (createLayoutsNotificationDto.padrao) {
			const padrao = await this.prisma.layoutsNotificacao.findFirst({
				where: { padrao: true, empresa_id },
			});
			if (padrao) {
				await this.prisma.layoutsNotificacao.updateMany({
					data: { padrao: false },
					where: { padrao: true, empresa_id },
				});
			}
		}
		return this.prisma.layoutsNotificacao.create({
			data: {
				nome: createLayoutsNotificationDto.nome,
				modelo: createLayoutsNotificationDto.modelo,
				ativo: createLayoutsNotificationDto.ativo,
				empresa_id,
				padrao: !!createLayoutsNotificationDto.padrao,
			},
		});
	}

	findAll(empresa_id: number, ativo?: boolean) {
		return this.prisma.layoutsNotificacao.findMany({
			where: { empresa_id, ativo },
		});
	}

	findOne(id: number, empresa_id: number) {
		return this.prisma.layoutsNotificacao.findFirst({
			where: { id, empresa_id },
		});
	}

	async update(
		id: number,
		updateLayoutsNotificationDto: UpdateLayoutsNotificationDto,
		empresa_id: number,
	) {
		if (updateLayoutsNotificationDto.padrao) {
			const padrao = await this.prisma.layoutsNotificacao.findFirst({
				where: { padrao: true, empresa_id },
			});
			if (padrao) {
				await this.prisma.layoutsNotificacao.updateMany({
					data: { padrao: false },
					where: { padrao: true, empresa_id },
				});
			}
		}
		return this.prisma.layoutsNotificacao.update({
			data: {
				nome: updateLayoutsNotificationDto.nome,
				modelo: updateLayoutsNotificationDto.modelo,
				ativo: updateLayoutsNotificationDto.ativo,
				padrao: !!updateLayoutsNotificationDto.padrao,
			},
			where: { id },
		});
	}

	remove(id: number) {
		return `This action removes a #${id} layoutsNotification`;
	}

	findPadrao(empresa_id: number) {
		return this.prisma.layoutsNotificacao.findFirst({
			where: { padrao: true, empresa_id },
		});
	}
}
