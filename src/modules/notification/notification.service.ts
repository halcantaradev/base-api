import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class NotificationService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createNotificationDto: CreateNotificationDto) {
		await this.prisma.notificacao.create({
			data: {
				unidade_id: createNotificationDto.unidade_id,
				infracao_id: createNotificationDto.infracao_id,
				tipo_registro: createNotificationDto.tipo_registro,
				data_emissao: createNotificationDto.data_emissao,
				data_infracao: createNotificationDto.data_infracao,
				fundamentacao_legal: createNotificationDto.fundamentacao_legal,
				n_notificacao: createNotificationDto.n_notificacao,
				detalhes_infracao: createNotificationDto.detalhes_infracao,
			},
		});

		return { success: true };
	}

	async findAll() {
		return this.prisma.notificacao.findMany({
			select: {
				id: true,
				unidade: { select: { codigo: true } },
				tipo_infracao: {
					select: { descricao: true },
				},
				tipo_registro: true,
				data_emissao: true,
				data_infracao: true,
				n_notificacao: true,
				detalhes_infracao: true,
				fundamentacao_legal: true,
				observacao: true,
			},
		});
	}

	async findOne(id: number) {
		return this.prisma.notificacao.findFirst({
			select: {
				id: true,
				unidade: { select: { codigo: true } },
				tipo_infracao: {
					select: { descricao: true },
				},
				tipo_registro: true,
				data_emissao: true,
				data_infracao: true,
				n_notificacao: true,
				detalhes_infracao: true,
				fundamentacao_legal: true,
				observacao: true,
			},
			where: {
				id,
			},
		});
	}

	async update(id: number, updateNotificationDto: UpdateNotificationDto) {
		return {
			success: true,
			data: await this.prisma.notificacao.update({
				select: {
					id: true,
					unidade: { select: { codigo: true } },
					tipo_infracao: {
						select: { descricao: true },
					},
					tipo_registro: true,
					data_emissao: true,
					data_infracao: true,
					n_notificacao: true,
					detalhes_infracao: true,
					fundamentacao_legal: true,
					observacao: true,
				},
				data: {
					unidade_id: updateNotificationDto.unidade_id,
					infracao_id: updateNotificationDto.infracao_id,
					tipo_registro: updateNotificationDto.tipo_registro,
					data_emissao: updateNotificationDto.data_emissao,
					data_infracao: updateNotificationDto.data_infracao,
					fundamentacao_legal:
						updateNotificationDto.fundamentacao_legal,
					n_notificacao: updateNotificationDto.n_notificacao,
					detalhes_infracao: updateNotificationDto.detalhes_infracao,
					ativo: updateNotificationDto.ativo,
				},
				where: { id },
			}),
		};
	}
}
