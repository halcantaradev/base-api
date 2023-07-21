import { BadRequestException, Injectable } from '@nestjs/common';
import { Pagination } from 'src/shared/entities/pagination.entity';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { format } from 'src/shared/helpers/currency.helper';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CondominiumService } from '../condominium/condominium.service';
import { Condominium } from '../condominium/entities/condominium.entity';
import { SetupService } from '../setup/setup.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { FilterNotificationDto } from './dto/filter-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ValidateNotificationDto } from './dto/validate-notification.dto';
import { ReturnNotificationListEntity } from './entities/return-notification-list.entity';
import { ReturnNotificationEntity } from './entities/return-notification.entity';
import { ValidatedNotification } from './entities/validated-notification.entity';

@Injectable()
export class NotificationService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly condomonioService: CondominiumService,
		private readonly setupService: SetupService,
	) {}

	async create(createNotificationDto: CreateNotificationDto) {
		createNotificationDto.unir_taxa = !!createNotificationDto.unir_taxa;
		let codigo: string = (
			(await this.findQtdByResidence(createNotificationDto.unidade_id)) +
			1
		).toString();
		codigo = codigo.padStart(2, '0');

		const data = await this.prisma.notificacao.create({
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

		return {
			success: true,
			message: 'Notificação criada com sucesso.',
			data: { id: data.id },
		};
	}

	async findBy(
		user: UserAuth,
		report: boolean,
		filtro?: FilterNotificationDto,
		pagination?: Pagination,
	) {
		let idsConsultores: number[] | null = null;

		if (
			filtro.consultores_ids?.length &&
			!user.acessa_todos_departamentos
		) {
			const consultoresDepartamentos =
				await this.prisma.usuarioHasDepartamentos.findMany({
					where: {
						departamento_id: {
							in: user.departamentos_ids,
						},
						usuario_id: {
							in: [...filtro.consultores_ids, user.id],
						},
					},
				});

			idsConsultores = consultoresDepartamentos.map(
				(consultor) => consultor.usuario_id,
			);
		} else if (filtro.consultores_ids?.length) {
			idsConsultores = filtro.consultores_ids;
		} else if (!user.acessa_todos_departamentos) {
			const consultoresDepartamentos =
				await this.prisma.usuarioHasDepartamentos.findMany({
					where: {
						departamento_id: {
							in: user.departamentos_ids,
						},
						usuario_id: user.id,
					},
				});

			idsConsultores = consultoresDepartamentos.map(
				(consultor) => consultor.usuario_id,
			);
		}

		const notifications = await this.prisma.pessoa.findMany({
			select: {
				id: true,
				nome: true,
				endereco: true,
				unidades_condominio: {
					select: {
						id: true,
						codigo: true,
						condominos: {
							select: { condomino: true, tipo: true },
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
										ativo: true,
										tipo_registro: filtro.tipo_registro
											? filtro.tipo_registro
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
																	gte: filtro.data_inicial
																		? filtro.data_inicial
																		: undefined,
																	lte: filtro.data_final
																		? filtro.data_final
																		: undefined,
																},
														  }
														: {
																data_infracao: {
																	gte: filtro.data_inicial
																		? filtro.data_inicial
																		: undefined,
																	lte: filtro.data_final
																		? filtro.data_final
																		: undefined,
																},
														  },
											  ]
											: undefined,
									},
								},
						  }
						: undefined,
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
				empresa_id: user.empresa_id,
				id: filtro.condominios_ids
					? { in: filtro.condominios_ids }
					: undefined,
				departamentos_condominio: !user.acessa_todos_departamentos
					? {
							some: {
								departamento_id: {
									in: user.departamentos_ids,
								},
							},
					  }
					: {
							some: {},
					  },
				usuarios_condominio: idsConsultores
					? {
							some: {
								usuario_id: {
									in: idsConsultores,
								},
							},
					  }
					: undefined,
				unidades_condominio: filtro
					? {
							some: {
								id: filtro.unidades_ids
									? {
											in: filtro.unidades_ids,
									  }
									: undefined,
								notificacoes: { some: { ativo: true } },
							},
					  }
					: undefined,
			},
			take: !report && pagination?.page ? 20 : 100,
			skip:
				!report && pagination?.page
					? (pagination?.page - 1) * 20
					: undefined,
		});

		const total_pages = !report
			? await this.prisma.pessoa.count({
					where: {
						tipos: {
							some: {
								tipo: {
									nome: 'condominio',
								},
							},
						},
						empresa_id: user.empresa_id,
						id: filtro.condominios_ids
							? { in: filtro.condominios_ids }
							: undefined,
						departamentos_condominio:
							!user.acessa_todos_departamentos
								? {
										some: {
											departamento_id: {
												in: user.departamentos_ids,
											},
										},
								  }
								: {
										some: {},
								  },
						usuarios_condominio: idsConsultores
							? {
									some: {
										usuario_id: {
											in: idsConsultores,
										},
									},
							  }
							: undefined,
						unidades_condominio: filtro
							? {
									some: {
										id: filtro.unidades_ids
											? {
													in: filtro.unidades_ids,
											  }
											: undefined,
										notificacoes: {
											some: {
												tipo_registro:
													filtro.tipo_registro
														? filtro.tipo_registro
														: undefined,
												tipo_infracao_id:
													filtro.tipo_infracao_id
														? filtro.tipo_infracao_id
														: undefined,
												OR: filtro.tipo_data_filtro
													? [
															filtro.tipo_data_filtro ==
															1
																? {
																		data_emissao:
																			{
																				gte: filtro.data_inicial
																					? filtro.data_inicial
																					: undefined,
																				lte: filtro.data_final
																					? filtro.data_final
																					: undefined,
																			},
																  }
																: {
																		data_infracao:
																			{
																				gte: filtro.data_inicial
																					? filtro.data_inicial
																					: undefined,
																				lte: filtro.data_final
																					? filtro.data_final
																					: undefined,
																			},
																  },
													  ]
													: undefined,
											},
										},
									},
							  }
							: undefined,
					},
			  })
			: 0;

		return {
			data: notifications,
			total_pages,
		};
	}
	async generateReport(
		user: UserAuth,
		report: boolean,
		filtro?: FilterNotificationDto,
		pagination?: Pagination,
	) {
		let idsConsultores: number[] | null = null;

		if (
			filtro.consultores_ids?.length &&
			!user.acessa_todos_departamentos
		) {
			const consultoresDepartamentos =
				await this.prisma.usuarioHasDepartamentos.findMany({
					where: {
						departamento_id: {
							in: user.departamentos_ids,
						},
						usuario_id: {
							in: [...filtro.consultores_ids, user.id],
						},
					},
				});

			idsConsultores = consultoresDepartamentos.map(
				(consultor) => consultor.usuario_id,
			);
		} else if (filtro.consultores_ids?.length) {
			idsConsultores = filtro.consultores_ids;
		} else if (!user.acessa_todos_departamentos) {
			const consultoresDepartamentos =
				await this.prisma.usuarioHasDepartamentos.findMany({
					where: {
						departamento_id: {
							in: user.departamentos_ids,
						},
						usuario_id: user.id,
					},
				});

			idsConsultores = consultoresDepartamentos.map(
				(consultor) => consultor.usuario_id,
			);
		}

		const notifications = await this.prisma.pessoa.findMany({
			select: {
				id: true,
				nome: true,
				endereco: true,
				unidades_condominio: {
					select: {
						id: true,
						codigo: true,
						notificacoes: {
							select: {
								tipo_registro: true,
								tipo_infracao_id: true,
								ativo: true,
								codigo: true,
								observacoes: true,
								pessoa_id: true,
								detalhes_infracao: true,
								vencimento_multa: true,
								competencia_multa: true,
								created_at: true,
								data_emissao: true,
								data_infracao: true,
								fundamentacao_legal: true,
								id: true,
								unidade_id: true,
								unir_taxa: true,
								updated_at: true,
								valor_multa: true,
								tipo_infracao: {
									select: { id: true, descricao: true },
								},
							},
							where: filtro
								? {
										id: filtro.unidades_ids
											? {
													in: filtro.unidades_ids,
											  }
											: undefined,
										OR: {
											ativo: true,
											tipo_registro: filtro.tipo_registro
												? filtro.tipo_registro
												: undefined,
											tipo_infracao_id:
												filtro.tipo_infracao_id
													? filtro.tipo_infracao_id
													: undefined,
											OR: filtro.tipo_data_filtro
												? [
														filtro.tipo_data_filtro ==
														1
															? {
																	data_emissao:
																		{
																			gte: filtro.data_inicial
																				? filtro.data_inicial
																				: undefined,
																			lte: filtro.data_final
																				? filtro.data_final
																				: undefined,
																		},
															  }
															: {
																	data_infracao:
																		{
																			gte: filtro.data_inicial
																				? filtro.data_inicial
																				: undefined,
																			lte: filtro.data_final
																				? filtro.data_final
																				: undefined,
																		},
															  },
												  ]
												: undefined,
										},
								  }
								: undefined,
						},
						condominos: {
							select: { condomino: true, tipo: true },
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
										ativo: true,
										tipo_registro: filtro.tipo_registro
											? filtro.tipo_registro
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
																	gte: filtro.data_inicial
																		? filtro.data_inicial
																		: undefined,
																	lte: filtro.data_final
																		? filtro.data_final
																		: undefined,
																},
														  }
														: {
																data_infracao: {
																	gte: filtro.data_inicial
																		? filtro.data_inicial
																		: undefined,
																	lte: filtro.data_final
																		? filtro.data_final
																		: undefined,
																},
														  },
											  ]
											: undefined,
									},
								},
						  }
						: undefined,
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
				empresa_id: user.empresa_id,
				id: filtro.condominios_ids
					? { in: filtro.condominios_ids }
					: undefined,
				departamentos_condominio: !user.acessa_todos_departamentos
					? {
							some: {
								departamento_id: {
									in: user.departamentos_ids,
								},
							},
					  }
					: {
							some: {},
					  },
				usuarios_condominio: idsConsultores
					? {
							some: {
								usuario_id: {
									in: idsConsultores,
								},
							},
					  }
					: undefined,
				unidades_condominio: filtro
					? {
							some: {
								id: filtro.unidades_ids
									? {
											in: filtro.unidades_ids,
									  }
									: undefined,
								notificacoes: { some: { ativo: true } },
							},
					  }
					: undefined,
			},
			take: !report && pagination?.page ? 20 : 100,
			skip:
				!report && pagination?.page
					? (pagination?.page - 1) * 20
					: undefined,
		});

		const total_pages = !report
			? await this.prisma.pessoa.count({
					where: {
						tipos: {
							some: {
								tipo: {
									nome: 'condominio',
								},
							},
						},
						empresa_id: user.empresa_id,
						id: filtro.condominios_ids
							? { in: filtro.condominios_ids }
							: undefined,
						departamentos_condominio:
							!user.acessa_todos_departamentos
								? {
										some: {
											departamento_id: {
												in: user.departamentos_ids,
											},
										},
								  }
								: {
										some: {},
								  },
						usuarios_condominio: idsConsultores
							? {
									some: {
										usuario_id: {
											in: idsConsultores,
										},
									},
							  }
							: undefined,
						unidades_condominio: filtro
							? {
									some: {
										id: filtro.unidades_ids
											? {
													in: filtro.unidades_ids,
											  }
											: undefined,
										notificacoes: {
											some: {
												tipo_registro:
													filtro.tipo_registro
														? filtro.tipo_registro
														: undefined,
												tipo_infracao_id:
													filtro.tipo_infracao_id
														? filtro.tipo_infracao_id
														: undefined,
												OR: filtro.tipo_data_filtro
													? [
															filtro.tipo_data_filtro ==
															1
																? {
																		data_emissao:
																			{
																				gte: filtro.data_inicial
																					? filtro.data_inicial
																					: undefined,
																				lte: filtro.data_final
																					? filtro.data_final
																					: undefined,
																			},
																  }
																: {
																		data_infracao:
																			{
																				gte: filtro.data_inicial
																					? filtro.data_inicial
																					: undefined,
																				lte: filtro.data_final
																					? filtro.data_final
																					: undefined,
																			},
																  },
													  ]
													: undefined,
											},
										},
									},
							  }
							: undefined,
					},
			  })
			: 0;

		return {
			data: notifications,
			total_pages,
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

		const fundamentacao_legal = (
			await this.prisma.tipoInfracao.findFirst({
				where: {
					id: validateNotificationDto.tipo_infracao_id,
				},
			})
		)?.fundamentacao_legal;
		if (!setup)
			return {
				tipo_registro: validateNotificationDto.tipo_registro,
				valor_multa: null,
				fundamentacao_legal,
			};

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

			if (
				notificacoes.length == 1 ||
				validateNotificationDto.tipo_registro === 2
			) {
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

						valor_multa = setupSistema?.salario_minimo_base || 0;
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
					valor_multa: format(
						valor_multa *
							(setup.primeira_reincidencia_percentual_pagamento /
								100),
					),
					tipo_registro:
						validateNotificationDto.tipo_registro &&
						!notificacoes.length
							? validateNotificationDto.tipo_registro
							: 2,
					fundamentacao_legal,
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
						valor_multa: format(valor_multa),
						tipo_registro: 2,
						fundamentacao_legal,
					};
				}

				return {
					valor_multa: 0,
					tipo_registro: 2,
					fundamentacao_legal,
				};
			}
		}

		return { valor_multa: null, tipo_registro: 1, fundamentacao_legal };
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

	async findOneById(id: number): Promise<ReturnNotificationEntity> {
		const notification = await this.prisma.notificacao.findFirst({
			include: {
				unidade: {
					select: {
						id: true,
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

		return {
			success: true,
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
			throw new BadRequestException('Notificação não encontrada');

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
					tipo_infracao_id: updateNotificationDto.tipo_infracao_id,
					tipo_registro: updateNotificationDto.tipo_registro,
					data_emissao: updateNotificationDto.data_emissao,
					data_infracao: updateNotificationDto.data_infracao,
					fundamentacao_legal:
						updateNotificationDto.fundamentacao_legal,
					detalhes_infracao: updateNotificationDto.detalhes_infracao,
					ativo: updateNotificationDto.ativo,
					competencia_multa: updateNotificationDto.competencia_multa,
					valor_multa: updateNotificationDto.valor_multa,
					vencimento_multa: updateNotificationDto.vencimento_multa,
					unir_taxa: updateNotificationDto.unir_taxa,
					observacoes: updateNotificationDto.observacoes,
				},
				where: { id },
			}),
		};
	}

	async dataToHandle(id: number, user: UserAuth) {
		const dataToPrint: {
			[key: string]: number | string | Date | undefined;
		} = {};
		const data = await this.prisma.notificacao.findFirst({
			include: {
				unidade: {
					include: {
						condominio: true,
						condominos: {
							include: { condomino: true, tipo: true },
						},
					},
				},
			},
			where: { id },
		});
		const condominio: Condominium = await this.condomonioService.findOne(
			data.unidade.condominio_id,
			user,
		);
		const setupSistema = await this.setupService.findSetupSystem(
			user.empresa_id,
		);
		const setupNotificacao = await this.setupService.findSetupNotification(
			condominio.id,
		);
		const sindico = condominio.condominio_administracao.filter(
			(item) => item.cargo.sindico,
		);

		dataToPrint.nome_sindico = sindico.length ? sindico[0].nome : '';
		dataToPrint.sancao_padrao = setupSistema ? setupSistema.sancao : '';
		dataToPrint.texto_padrao_notificacao = setupSistema
			? setupSistema.texto_padrao_notificacao
			: '';
		dataToPrint.observacao_padrao_notificacao_condominio = setupNotificacao
			? setupNotificacao.observacoes
			: '';

		dataToPrint.data_atual = new Intl.DateTimeFormat('pt-BR', {
			dateStyle: 'short',
		}).format(new Date());
		dataToPrint.data_atual_extenso = new Intl.DateTimeFormat('pt-BR', {
			dateStyle: 'long',
		}).format(new Date());
		dataToPrint.nome_condominio = data.unidade.condominio.nome;
		dataToPrint.cidade_condominio = data.unidade.condominio.cidade;
		dataToPrint.cnpj_condominio = data.unidade.condominio.cnpj;
		dataToPrint.cep_condominio = data.unidade.condominio.cep;
		dataToPrint.uf_condominio = data.unidade.condominio.uf;
		dataToPrint.bairro_condominio = data.unidade.condominio.bairro;
		dataToPrint.numero_condominio =
			(data as any).unidade.condominio.numero || '';
		dataToPrint.endereco_condominio = (
			data as any
		).unidade.condominio.endereco;
		dataToPrint.endereco_completo_condominio = `${
			dataToPrint.endereco_condominio || ''
		}, ${dataToPrint.numero_condominio || ''} - ${
			dataToPrint.bairro_condominio || ''
		}`;

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

		const condomino = data.unidade.condominos.filter(
			(item) => item.condomino.id == data.pessoa_id,
		)[0];

		dataToPrint.tipo_responsavel_notificado = condomino.tipo.descricao;
		dataToPrint.responsavel_notificado = condomino.condomino.nome;

		return dataToPrint;
	}

	async findByUnidade(
		unidade_id: number,
		notificationUnidadeDTO: FilterNotificationDto,
		page?: number,
	) {
		const where = {
			unidade_id,
			unidade: {
				condominio: {
					id: { in: notificationUnidadeDTO.condominos_ids },
				},
			},
			ativo: true,
			tipo_infracao_id: notificationUnidadeDTO.tipo_infracao_id
				? notificationUnidadeDTO.tipo_infracao_id
				: undefined,
			tipo_registro: notificationUnidadeDTO.tipo_registro
				? notificationUnidadeDTO.tipo_registro
				: undefined,
			OR: notificationUnidadeDTO.tipo_data_filtro
				? [
						notificationUnidadeDTO.tipo_data_filtro == 1
							? {
									data_emissao: {
										gte: notificationUnidadeDTO.data_inicial
											? notificationUnidadeDTO.data_inicial
											: undefined,
										lte: notificationUnidadeDTO.data_final
											? notificationUnidadeDTO.data_final
											: undefined,
									},
							  }
							: {
									data_infracao: {
										gte: notificationUnidadeDTO.data_inicial
											? notificationUnidadeDTO.data_inicial
											: undefined,
										lte: notificationUnidadeDTO.data_final
											? notificationUnidadeDTO.data_final
											: undefined,
									},
							  },
				  ]
				: undefined,
		};

		const total_pages = await this.prisma.notificacao.count({ where });

		const data = await this.prisma.notificacao.findMany({
			include: {
				pessoa: { select: { nome: true } },
				tipo_infracao: { select: { descricao: true } },
			},
			where,
			skip: page ? (page - 1) * 10 : undefined,
			take: 10,
		});
		return { total_pages, data };
	}
}
