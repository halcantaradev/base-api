import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'src/shared/services/prisma.service';
import { ReturnNotificationEntity } from './entities/return-notification.entity';
import { ReturnNotificationListEntity } from './entities/return-notification-list.entity';
import { FilterNotificationDto } from './dto/filter-notification.dto';

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

		return { success: true, message: 'Notificação criada com sucesso.' };
	}

	async reportByCondominium(filtro: FilterNotificationDto) {
		console.log(filtro);
		const report = await this.prisma.pessoa.findMany({
			select: {
				nome: true,
				unidade: {
					select: {
						codigo: true,
						_count: { select: { Notificacao: true } },
						Notificacao: {
							select: {
								id: true,
								data_emissao: true,
								data_infracao: true,
								tipo_registro: true,
								infracao_id: true,
								observacao: true,
								detalhes_infracao: true,
								tipo_infracao: {
									select: {
										descricao: true,
									},
								},
							},
						},
					},
					where: {
						id: { in: filtro.unidades_ids },
						PessoasHasUnidades: {
							every: {
								pessoa_id: { in: filtro.condominos_ids },
							},
						},
						Notificacao: {
							every: {
								tipo_registro: filtro.tipo_notificacao,
								infracao_id: filtro.tipo_infracao_id,
								OR: [
									filtro.tipo_data_filtro === 1
										? {
												data_emissao: {
													gte: new Date(
														filtro.data_inicial,
													),
													lte: new Date(
														filtro.data_final,
													),
												},
										  }
										: {
												data_infracao: {
													gte: new Date(
														filtro.data_inicial,
													),
													lte: new Date(
														filtro.data_final,
													),
												},
										  },
								],
							},
						},
					},
				},
			},
			where: {
				pessoas_has_tipos: {
					every: {
						tipo: {
							nome: 'condominio',
						},
					},
				},
				AND: [
					filtro.condominios_ids
						? { id: { in: filtro.condominios_ids } }
						: {},
				],
			},
		});

		if (!report) {
			throw new NotFoundException(
				'Dados não encontrados, por favor verifique os filtros!',
			);
		}

		return {
			success: true,
			message: 'Notificações listadas com sucesso.',
			data: report,
		};
	}

	async findAll(): Promise<ReturnNotificationListEntity> {
		return {
			success: true,
			message: 'Notificações listadas com sucesso.',
			data: await this.prisma.notificacao.findMany({
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
			}),
		};
	}

	async findOneById(id: number): Promise<ReturnNotificationEntity> {
		const notification = await this.prisma.notificacao.findFirst({
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

		if (notification == null)
			throw new NotFoundException('Notificação não encontrada');

		return {
			success: true,
			message: 'Notificação listada com sucesso.',
			data: notification,
		};
	}

	async update(
		id: number,
		updateNotificationDto: UpdateNotificationDto,
	): Promise<ReturnNotificationEntity> {
		const notification = await this.prisma.notificacao.findUnique({
			where: { id },
		});

		if (notification == null)
			throw new NotFoundException('Notificação não encontrada');

		return {
			success: true,
			message: 'Notificação atualizada com sucesso.',
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
