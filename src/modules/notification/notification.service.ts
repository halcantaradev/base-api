import { ValidateNotificationDto } from './dto/validate-notification.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'src/shared/services/prisma.service';
import { ReturnNotificationEntity } from './entities/return-notification.entity';
import { ReturnNotificationListEntity } from './entities/return-notification-list.entity';
import { FilterNotificationDto } from './dto/filter-notification.dto';
import { ReturnInfractionListEntity } from './entities/return-infraction-list.entity';
<<<<<<< HEAD
import { NotificationEntity } from './entities/notification.entity';
=======
import { ValidatedNotification } from './entities/validated-notification.entity';
>>>>>>> 57cd4763846b43aaae71e13e63681a77b0e66e3c

@Injectable()
export class NotificationService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createNotificationDto: CreateNotificationDto) {
		let codigo: string = (
			(await this.findQtdByResidence(createNotificationDto.unidade_id)) +
			1
		).toString();
		codigo = codigo.padStart(2, '0');

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

	async findBy(filtro?: FilterNotificationDto) {
		const notifications = await this.prisma.pessoa.findMany({
			select: {
				id: true,
				nome: true,
				endereco: true,
				unidades_condominio: {
					select: {
						codigo: true,
						notificacoes: {
							select: {
								id: true,
								data_emissao: true,
								data_infracao: true,
								tipo_registro: true,
								tipo_infracao_id: true,
								valor_multa: true,
								observacoes: true,
								detalhes_infracao: true,
								tipo_infracao: {
									select: {
										descricao: true,
									},
								},
								pessoa: {
									select: {
										nome: true,
									},
								},
								unidade: {
									select: {
										condominos: {
											select: {
												condomino: {
													select: { nome: true },
												},
												tipo: {
													select: { nome: true },
												},
											},
										},
									},
								},
							},
							where: filtro
								? {
										tipo_registro: filtro.tipo_notificacao
											? filtro.tipo_notificacao
											: undefined,
										tipo_infracao_id:
											filtro.tipo_infracao_id
												? filtro.tipo_infracao_id
												: undefined,
										OR: filtro.tipo_data_filtro
											? [
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
											  ]
											: undefined,
								  }
								: undefined,
						},
					},
					where: filtro
						? {
								id: filtro.unidades_ids
									? {
											in: filtro.unidades_ids,
									  }
									: undefined,
								notificacoes: {
									some: {
										tipo_registro: filtro.tipo_notificacao
											? filtro.tipo_notificacao
											: undefined,
										tipo_infracao_id:
											filtro.tipo_infracao_id
												? filtro.tipo_infracao_id
												: undefined,
										OR: filtro.tipo_data_filtro
											? [
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
											  ]
											: undefined,
									},
								},
						  }
						: {},
				},
			},
			where: {
				tipos: {
					some: {
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

	async validateNotification(
		validateNotificationDto: ValidateNotificationDto,
	): Promise<ValidatedNotification | null> {
		const setup = await this.prisma.notificacaoSetup.findFirst({
			where: {
				condominio: {
					unidades_condominio: {
						some: {
							id: validateNotificationDto.unidade_id,
						},
					},
				},
			},
		});

		if (!setup) return null;

		if (setup.primeira_reincidencia) {
			const notificacoes = await this.prisma.notificacao.findMany({
				where: {
					unidade_id: validateNotificationDto.unidade_id,
					tipo_infracao_id: validateNotificationDto.tipo_infracao_id,
					data_infracao: {
						gte: new Date(
							new Date(
								validateNotificationDto.data_infracao,
							).setMonth(
								validateNotificationDto.data_infracao.getMonth() -
									12,
							),
						),
						lte: validateNotificationDto.data_infracao,
					},
				},
				orderBy: {
					data_infracao: 'desc',
				},
			});

			if (notificacoes.length == 1) {
				let valor_multa = 0;
				let taxaUnidade = null;

				switch (setup.primeira_reincidencia_base_pagamento) {
					case 1: // Taxa de condomínio
						taxaUnidade =
							await this.prisma.unidadeHasTaxas.findFirst({
								where: {
									unidade_id:
										validateNotificationDto.unidade_id,
									taxa: {
										descricao: 'Taxa de Condomínio',
									},
								},
							});

						valor_multa = taxaUnidade.valor;

						break;
					case 2: // Salário mínimo
						const setupSistema =
							await this.prisma.sistemaSetup.findFirst();

						valor_multa = setupSistema.salario_minimo_base;
						break;
					case 3: // Menor Taxa de condomínio
						taxaUnidade =
							await this.prisma.unidadeHasTaxas.findFirst({
								where: {
									unidade: {
										condominio: {
											unidades: {
												some: {
													unidade_id:
														validateNotificationDto.unidade_id,
												},
											},
										},
									},
									taxa: {
										descricao: 'Taxa de Condomínio',
									},
								},
								orderBy: {
									valor: 'desc',
								},
							});

						valor_multa = taxaUnidade.valor;

						break;
				}

				return {
					valor_multa:
						valor_multa *
						(setup.primeira_reincidencia_percentual_pagamento /
							100),
					tipo_registro: 2,
				};
			}

			if (notificacoes.length > 1) {
				if (setup.segunda_reincidencia) {
					let valor_multa = 0;

					switch (setup.segunda_reincidencia_base_pagamento) {
						case 1: // Dobrar valor da última multa
							valor_multa = notificacoes.at(0).valor_multa * 2;

							break;
						case 2: // Dobrar valor da primeira multa
							valor_multa = notificacoes.at(-1).valor_multa * 2;

							break;
						case 3: // Repetir valor da última multa
							valor_multa = notificacoes.at(0).valor_multa;

							break;
					}

					return {
						valor_multa,
						tipo_registro: 2,
					};
				}

				return {
					valor_multa: 0,
					tipo_registro: 2,
				};
			}
		}

		return { valor_multa: null, tipo_registro: 1 };
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
				unidade: {
					select: {
						codigo: true,
						condominos: {
							select: {
								condomino: { select: { id: true, nome: true } },
								tipo: {
									select: { nome: true, descricao: true },
								},
							},
						},
						condominio: true,
					},
				},
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

	async dataToHandle(id: number) {
		const data: NotificationEntity = (await this.findOneById(id)).data;
		const dataToPrint: {
			[key: string]: number | string | Date | undefined;
		} = {};

		dataToPrint.data_atual = new Intl.DateTimeFormat('pt-BR', {
			dateStyle: 'short',
		}).format(new Date());
		dataToPrint.data_atual_extenso = new Intl.DateTimeFormat('pt-BR', {
			dateStyle: 'long',
		}).format(new Date());
		dataToPrint.nome_condominio = (data as any).unidade.condominio.nome;
		dataToPrint.cidade_condominio = (data as any).unidade.condominio.cidade;
		dataToPrint.cnpj_condominio = (data as any).unidade.condominio.cnpj;
		dataToPrint.cidade_condominio = (data as any).unidade.condominio.cep;
		dataToPrint.endereco_condominio = (data as any).unidade.condominio.uf;
		dataToPrint.bairro_condominio = (data as any).unidade.condominio.bairro;
		dataToPrint.codigo_unidade = data.unidade.codigo;
		dataToPrint.tipo_notificacao =
			data.tipo_registro == 1 ? 'INFRAÇÃO' : 'MULTA';
		dataToPrint.numero_notificacao = data.codigo;
		dataToPrint.data_infracao = new Intl.DateTimeFormat('pt-BR', {
			dateStyle: 'short',
			timeStyle: 'short',
		}).format(data.data_infracao);
		dataToPrint.detalhes_infracao = data.detalhes_infracao;
		dataToPrint.fundamentacao_legal = data.fundamentacao_legal;
		dataToPrint.observacoes_notificacao = data.observacoes;

		const condominio = (data as any).unidade.condominos.filter(
			(item) => item.condomino.id == data.pessoa_id,
		)[0];

		dataToPrint.tipo_responsavel_notificado = condominio.tipo.descricao;
		dataToPrint.responsavel_notificado = condominio.condomino.nome;

		return {
			dataToPrint,
			numero: data.codigo,
		};
	}
}
