import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'src/shared/services/prisma.service';
import { ReturnNotificationEntity } from './entities/return-notification.entity';
import { ReturnNotificationListEntity } from './entities/return-notification-list.entity';
import { FilterNotificationDto } from './dto/filter-notification.dto';
import { ReturnInfractionListEntity } from './entities/return-infraction-list.entity';

@Injectable()
export class NotificationService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createNotificationDto: CreateNotificationDto) {
		let codigo: any =
			(await this.findQtdByResidence(createNotificationDto.unidade_id)) +
			1;

		codigo = codigo.toString().padStart(2, '0');

		await this.prisma.notificacao.create({
			data: {
				unidade_id: createNotificationDto.unidade_id,
				tipo_infracao_id: createNotificationDto.tipo_infracao_id,
				tipo_registro: createNotificationDto.tipo_registro,
				data_emissao: createNotificationDto.data_emissao,
				data_infracao: createNotificationDto.data_infracao,
				fundamentacao_legal: createNotificationDto.fundamentacao_legal,
				codigo: `${codigo}/${new Date().getFullYear()}`,
				detalhes_infracao: createNotificationDto.detalhes_infracao,
				valor_multa: createNotificationDto.valor_multa,
				competencia_multa: createNotificationDto.competencia_multa,
				unir_taxa: createNotificationDto.unir_taxa,
				vencimento_multa: createNotificationDto.vencimento_multa,
				observacoes: createNotificationDto.observacoes,
				pessoa_id: createNotificationDto.pessoa_id,
			},
		});

		return { success: true, message: 'Notificação criada com sucesso.' };
	}

	async findBy(filtro: FilterNotificationDto, rows, skip) {
		const notifications = await this.prisma.pessoa.findMany({
			take: +rows || 10,
			skip: +skip || 0,
			select: {
				nome: true,
				unidades_condominio: {
					select: {
						codigo: true,
						_count: { select: { notificacoes: true } },
						notificacoes: {
							select: {
								id: true,
								data_emissao: true,
								data_infracao: true,
								tipo_registro: true,
								tipo_infracao_id: true,
								observacoes: true,
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
						condominos: {
							every: { pessoa_id: { in: filtro.condominos_ids } },
						},
						notificacoes: {
							every: {
								tipo_registro: filtro.tipo_notificacao,
								tipo_infracao_id: filtro.tipo_infracao_id,
								OR: [
									filtro.tipo_data_filtro == 1
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
				tipos: {
					every: {
						tipo: {
							nome: 'condominio',
						},
					},
				},
				id: filtro.condominios_ids
					? { in: filtro.condominios_ids }
					: undefined,
			},
		});

		console.log(notifications);

		if (!notifications) {
			throw new NotFoundException(
				'Dados não encontrados, por favor verifique os filtros!',
			);
		}

		return {
			success: true,
			data: notifications,
		};
	}

	async reportByCondominium(filtro: FilterNotificationDto) {
		const report = await this.prisma.pessoa.findMany({
			select: {
				nome: true,
				unidades_condominio: {
					select: {
						codigo: true,
						_count: { select: { notificacoes: true } },
						notificacoes: {
							select: {
								id: true,
								data_emissao: true,
								data_infracao: true,
								tipo_registro: true,
								tipo_infracao_id: true,
								observacoes: true,
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
						condominos: {
							every: {
								pessoa_id: { in: filtro.condominos_ids },
							},
						},
						notificacoes: {
							every: {
								tipo_registro: filtro.tipo_notificacao,
								tipo_infracao_id: filtro.tipo_infracao_id,
								OR: [
									filtro.tipo_data_filtro == 1
										? {
												data_emissao: {
													gte: filtro.data_inicial,
													lte: filtro.data_final,
												},
										  }
										: {
												data_infracao: {
													gte: filtro.data_inicial,
													lte: filtro.data_final,
												},
										  },
								],
							},
						},
					},
				},
			},
			where: {
				tipos: {
					every: {
						tipo: {
							nome: 'condominio',
						},
					},
				},
				id: filtro.condominios_ids
					? { in: filtro.condominios_ids }
					: undefined,
			},
		});

		if (!report) {
			throw new NotFoundException(
				'Dados não encontrados, por favor verifique os filtros!',
			);
		}

		return {
			success: true,
			data: report,
		};
	}

	async findAll(): Promise<ReturnNotificationListEntity> {
		return {
			success: true,
			data: await this.prisma.notificacao.findMany({
				select: {
					id: true,
					codigo: true,
					unidade: { select: { codigo: true } },
					tipo_infracao: {
						select: { descricao: true },
					},
					tipo_registro: true,
					data_emissao: true,
					data_infracao: true,
					unidade_id: true,
					detalhes_infracao: true,
					fundamentacao_legal: true,
					observacoes: true,
				},
			}),
		};
	}

	async findQtdByResidence(unidade_id: number): Promise<number> {
		return this.prisma.notificacao.count({
			where: {
				unidade_id,
			},
		});
	}

	async findAllInfraction(): Promise<ReturnInfractionListEntity> {
		return {
			success: true,
			data: await this.prisma.tipoInfracao.findMany({
				select: {
					id: true,
					descricao: true,
				},
				where: {
					ativo: true,
				},
			}),
		};
	}

	async findOneById(id: number): Promise<ReturnNotificationEntity> {
		const notification = await this.prisma.notificacao.findFirst({
			include: {
				unidade: { select: { codigo: true } },
				tipo_infracao: {
					select: { descricao: true },
				},
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
					codigo: true,
					detalhes_infracao: true,
					fundamentacao_legal: true,
					observacoes: true,
					valor_multa: true,
					competencia_multa: true,
					unir_taxa: true,
					vencimento_multa: true,
				},
				data: {
					unidade_id: updateNotificationDto.unidade_id,
					tipo_infracao_id: updateNotificationDto.infracao_id,
					tipo_registro: updateNotificationDto.tipo_registro,
					data_emissao: updateNotificationDto.data_emissao,
					data_infracao: updateNotificationDto.data_infracao,
					fundamentacao_legal:
						updateNotificationDto.fundamentacao_legal,
					detalhes_infracao: updateNotificationDto.detalhes_infracao,
					ativo: updateNotificationDto.ativo,
				},
				where: { id },
			}),
		};
	}
}
