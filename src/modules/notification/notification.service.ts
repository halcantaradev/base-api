import { BadRequestException, Injectable } from '@nestjs/common';
import { Pagination } from 'src/shared/entities/pagination.entity';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { format } from 'src/shared/helpers/currency.helper';
import { EmailService } from 'src/shared/services/email.service';
import { ExternalJwtService } from 'src/shared/services/external-jwt/external-jwt.service';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { S3Service } from 'src/shared/services/s3.service';
import { CondominiumService } from '../condominium/condominium.service';
import { Condominium } from '../condominium/entities/condominium.entity';
import { SetupService } from '../setup/setup.service';
import { UploadFileService } from '../upload-file/upload-file.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { FilterNotificationDto } from './dto/filter-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ValidateNotificationDto } from './dto/validate-notification.dto';
import { ReturnNotificationListEntity } from './entities/return-notification-list.entity';
import { ReturnNotificationEntity } from './entities/return-notification.entity';
import { ValidatedNotification } from './entities/validated-notification.entity';
import { setCustomHour } from 'src/shared/helpers/date.helper';
import { defaultLogo } from 'src/shared/consts/default-logo.base64';
import { ContactType } from 'src/shared/consts/contact-type.const';
import { Contact } from 'src/shared/consts/contact.const';
import { SendMailNotificationDto } from './dto/send-mail-notification.dto';
import { LayoutsNotificationService } from '../layouts-notification/layouts-notification.service';
import { LayoutConstsService } from 'src/shared/services/layout-consts.service';
import { HandlebarsService } from 'src/shared/services/handlebars.service';

@Injectable()
export class NotificationService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly condomonioService: CondominiumService,
		private readonly setupService: SetupService,
		private readonly arquivoService: UploadFileService,
		private readonly emailService: EmailService,
		private readonly externalJtwService: ExternalJwtService,
		private readonly s3Service: S3Service,
		private readonly layoutNotificationServe: LayoutsNotificationService,
		private readonly layoutService: LayoutConstsService,
		private readonly handleBarService: HandlebarsService,
	) {}

	async create(createNotificationDto: CreateNotificationDto, user: UserAuth) {
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
				data_emissao: new Date(),
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
				layout_id: createNotificationDto.layout_id,
			},
		});

		const userLogado = await this.prisma.user.findUnique({
			where: { id: user.id },
		});

		const condomino = await this.prisma.pessoa.findUnique({
			where: { id: data.pessoa_id },
		});

		const url = this.externalJtwService.generateURLExternal({
			origin: 'notificacoes',
			data: { id: data.id },
		});

		const setupEmail = await this.prisma.emailSetup.findFirst({
			where: {
				empresa_id: user.empresa_id,
				padrao: true,
			},
		});

		if (setupEmail)
			await this.emailService.send({
				from: process.env.EMAIL_SEND_PROVIDER,
				html: `<p>Notificação criada para o condomino: ${condomino.nome} <br>
			Clique no link para acessar clique: <a href="${url}">${url}</a></p>`,
				subject: 'Notificação criada',
				to: userLogado.email,
				setup: {
					MAIL_SMTP_HOST: setupEmail.host,
					MAIL_SMTP_PORT: setupEmail.port,
					MAIL_SMTP_SECURE: setupEmail.secure,
					MAIL_SMTP_USER: setupEmail.user,
					MAIL_SMTP_PASS: setupEmail.password,
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

		const fullAccess = !!(await this.prisma.user.findFirst({
			where: {
				id: {
					in: filtro.consultores_ids,
				},
				acessa_todos_departamentos: true,
				departamentos: {
					none: {},
				},
			},
		}));

		const condominiums = await this.prisma.pessoa.findMany({
			select: {
				id: true,
				unidades_condominio: {
					select: {
						id: true,
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
										data_emissao: filtro.data_emissao
											? {
													gte:
														setCustomHour(
															filtro
																.data_emissao[0],
														) || undefined,
													lte:
														setCustomHour(
															filtro
																.data_emissao[1],
															23,
															59,
															59,
														) || undefined,
											  }
											: undefined,
										data_infracao: filtro.data_infracao
											? {
													gte:
														setCustomHour(
															filtro
																.data_infracao[0],
														) || undefined,
													lte:
														setCustomHour(
															filtro
																.data_infracao[1],
															23,
															59,
															59,
														) || undefined,
											  }
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
				OR:
					idsConsultores && !fullAccess
						? [
								{
									usuarios_condominio: {
										some: {
											usuario_id: {
												in: idsConsultores,
											},
										},
									},
								},
								{
									departamentos_condominio: {
										some: {
											departamento: {
												usuarios: {
													some: {
														usuario_id: {
															in: idsConsultores,
														},
														delimitar_acesso: false,
													},
												},
											},
										},
									},
								},
						  ]
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
										ativo: true,
										tipo_registro: filtro.tipo_registro
											? filtro.tipo_registro
											: undefined,
										tipo_infracao_id:
											filtro.tipo_infracao_id
												? filtro.tipo_infracao_id
												: undefined,
										data_emissao: filtro.data_emissao
											? {
													gte:
														setCustomHour(
															filtro
																.data_emissao[0],
														) || undefined,
													lte:
														setCustomHour(
															filtro
																.data_emissao[1],
															23,
															59,
															59,
														) || undefined,
											  }
											: undefined,

										data_infracao: filtro.data_infracao
											? {
													gte:
														setCustomHour(
															filtro
																.data_infracao[0],
														) || undefined,
													lte:
														setCustomHour(
															filtro
																.data_infracao[1],
															23,
															59,
															59,
														) || undefined,
											  }
											: undefined,
									},
								},
							},
					  }
					: undefined,
			},
		});

		const setup = await this.prisma.notificacaoSetup.findMany({
			select: { condominio_id: true, prazo_interpor_recurso: true },
			where: {
				condominio_id: {
					in: condominiums.map((notificacao) => notificacao.id),
				},
			},
		});

		const residences_ids: number[] = [];

		if (filtro.prazo_recurso && setup.length) {
			await Promise.all(
				condominiums.map(async (condominium) => {
					const setup_condominio = setup.find(
						(setup) => setup.condominio_id === condominium.id,
					);

					await Promise.all(
						condominium.unidades_condominio.map(
							async (residence) => {
								const dia = new Date();

								dia.setDate(
									new Date().getDate() -
										(setup_condominio?.prazo_interpor_recurso ||
											0),
								);

								let notification = true;
								if (
									!!setup_condominio?.prazo_interpor_recurso
								) {
									notification =
										!!(await this.prisma.notificacao.findFirst(
											{
												where: {
													data_emissao: {
														gte:
															filtro.prazo_recurso ==
															1
																? setCustomHour(
																		dia,
																  )
																: undefined,
														lt:
															filtro.prazo_recurso ==
															2
																? setCustomHour(
																		dia,
																  )
																: undefined,
													},
													unidade_id: residence.id,
													ativo: true,
												},
											},
										));
								}

								if (notification)
									residences_ids.push(residence.id);
							},
						),
					);
				}),
			);
		} else {
			condominiums.forEach((condominium) => {
				condominium.unidades_condominio.forEach((residence) =>
					residences_ids.push(residence.id),
				);
			});
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
					where: {
						AND: [
							{
								id: {
									in: residences_ids,
								},
							},
							{
								id: filtro.unidades_ids
									? {
											in: filtro.unidades_ids,
									  }
									: undefined,
							},
						],
					},
				},
			},
			where: {
				unidades_condominio: {
					some: {
						AND: [
							{
								id: {
									in: residences_ids,
								},
							},
							{
								id: filtro.unidades_ids
									? {
											in: filtro.unidades_ids,
									  }
									: undefined,
							},
						],
					},
				},
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
						unidades_condominio: {
							some: {
								id: {
									in: residences_ids,
								},
							},
						},
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

		const condominiums = await this.prisma.pessoa.findMany({
			select: {
				id: true,
				unidades_condominio: {
					select: {
						id: true,
						notificacoes: {
							select: {
								id: true,
								data_emissao: true,
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
											data_emissao: filtro.data_emissao
												? {
														gte:
															setCustomHour(
																filtro
																	.data_emissao[0],
															) || undefined,
														lte:
															setCustomHour(
																filtro
																	.data_emissao[1],
																23,
																59,
																59,
															) || undefined,
												  }
												: undefined,

											data_infracao: filtro.data_infracao
												? {
														gte:
															setCustomHour(
																filtro
																	.data_infracao[0],
															) || undefined,
														lte:
															setCustomHour(
																filtro
																	.data_infracao[1],
																23,
																59,
																59,
															) || undefined,
												  }
												: undefined,
										},
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
										ativo: true,
										tipo_registro: filtro.tipo_registro
											? filtro.tipo_registro
											: undefined,
										tipo_infracao_id:
											filtro.tipo_infracao_id
												? filtro.tipo_infracao_id
												: undefined,
										data_emissao: filtro.data_emissao
											? {
													gte:
														setCustomHour(
															filtro
																.data_emissao[0],
														) || undefined,
													lte:
														setCustomHour(
															filtro
																.data_emissao[1],
															23,
															59,
															59,
														) || undefined,
											  }
											: undefined,

										data_infracao: filtro.data_infracao
											? {
													gte:
														setCustomHour(
															filtro
																.data_infracao[0],
														) || undefined,
													lte:
														setCustomHour(
															filtro
																.data_infracao[1],
															23,
															59,
															59,
														) || undefined,
											  }
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
		});

		const setup = await this.prisma.notificacaoSetup.findMany({
			select: { condominio_id: true, prazo_interpor_recurso: true },
			where: {
				condominio_id: {
					in: condominiums.map((notificacao) => notificacao.id),
				},
			},
		});

		const notifications_ids: number[] = [];

		if (filtro.prazo_recurso && setup.length) {
			condominiums.forEach((condominium) => {
				const setup_condominio = setup.find(
					(setup) => setup.condominio_id === condominium.id,
				);

				condominium.unidades_condominio.forEach((residence) => {
					residence.notificacoes.forEach((notification) => {
						const dia = new Date();

						dia.setDate(
							new Date().getDate() -
								(setup_condominio?.prazo_interpor_recurso || 0),
						);

						if (
							(filtro.prazo_recurso == 1 &&
								notification.data_emissao >=
									setCustomHour(dia)) ||
							(filtro.prazo_recurso == 2 &&
								notification.data_emissao <
									setCustomHour(dia)) ||
							!!setup_condominio?.prazo_interpor_recurso
						) {
							notifications_ids.push(notification.id);
						}
					});
				});
			});
		} else {
			condominiums.map((condominium) => {
				condominium.unidades_condominio.forEach((residence) =>
					residence.notificacoes.forEach((notification) => {
						notifications_ids.push(notification.id);
					}),
				);
			});
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
							where: { id: { in: notifications_ids } },
						},
						condominos: {
							select: { condomino: true, tipo: true },
						},
					},
					where: {
						notificacoes: {
							some: { id: { in: notifications_ids } },
						},
					},
				},
			},
			where: {
				unidades_condominio: {
					some: {
						notificacoes: {
							some: { id: { in: notifications_ids } },
						},
					},
				},
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
												data_emissao:
													filtro.data_emissao
														? {
																gte: filtro
																	.data_emissao[0]
																	? filtro
																			.data_emissao[0]
																	: undefined,
																lte: filtro
																	.data_emissao[1]
																	? filtro
																			.data_emissao[1]
																	: undefined,
														  }
														: undefined,

												data_infracao:
													filtro.data_infracao
														? {
																gte: filtro
																	.data_infracao[0]
																	? filtro
																			.data_infracao[0]
																	: undefined,
																lte: filtro
																	.data_infracao[1]
																	? filtro
																			.data_infracao[1]
																	: undefined,
														  }
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

		const unidade = await this.prisma.unidade.findUnique({
			where: { id: validateNotificationDto.unidade_id },
		});

		let fundamentacao_legal_cond = null;
		if (unidade) {
			fundamentacao_legal_cond = (
				await this.prisma.condominioHasTipoInfracao.findFirst({
					where: {
						tipo_infracao_id:
							validateNotificationDto.tipo_infracao_id,
						condominio_id: unidade.condominio_id,
						excluido: false,
					},
				})
			)?.fundamentacao;
		}
		const fundamentacao_legal = (
			await this.prisma.tipoInfracao.findFirst({
				where: {
					id: validateNotificationDto.tipo_infracao_id,
				},
			})
		)?.fundamentacao_legal;

		if (!setup) {
			return {
				tipo_registro: validateNotificationDto.tipo_registro,
				valor_multa: null,
				fundamentacao_legal:
					fundamentacao_legal_cond || fundamentacao_legal,
			};
		}

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
					fundamentacao_legal:
						fundamentacao_legal_cond || fundamentacao_legal,
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
						fundamentacao_legal:
							fundamentacao_legal_cond || fundamentacao_legal,
					};
				}

				return {
					valor_multa: 0,
					tipo_registro: 2,
					fundamentacao_legal:
						fundamentacao_legal_cond || fundamentacao_legal,
				};
			}
		}

		return {
			valor_multa: null,
			tipo_registro: 1,
			fundamentacao_legal:
				fundamentacao_legal_cond || fundamentacao_legal,
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
					layout_id: true,
					doc_gerado: true,
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

	async findOneById(id: number) {
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

		const arquivos = await this.prisma.arquivo.findMany({
			where: {
				ativo: true,
				origem: 1,
				referencia_id: id,
			},
		});

		return notification ? { ...notification, arquivos } : null;
	}

	async update(
		id: number,
		updateNotificationDto: UpdateNotificationDto,
		user_id: number,
	): Promise<ReturnNotificationEntity> {
		const notification = await this.prisma.notificacao.findUnique({
			where: { id },
		});

		if (notification == null)
			throw new BadRequestException('Notificação não encontrada');

		const notificacaoResult = await this.prisma.notificacao.update({
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
				layout_id: true,
			},
			data: {
				unidade_id: updateNotificationDto.unidade_id,
				tipo_infracao_id: updateNotificationDto.tipo_infracao_id,
				tipo_registro: updateNotificationDto.tipo_registro,
				data_infracao: updateNotificationDto.data_infracao,
				fundamentacao_legal: updateNotificationDto.fundamentacao_legal,
				detalhes_infracao: updateNotificationDto.detalhes_infracao,
				ativo: updateNotificationDto.ativo,
				competencia_multa: updateNotificationDto.competencia_multa,
				valor_multa: updateNotificationDto.valor_multa,
				vencimento_multa: updateNotificationDto.vencimento_multa,
				unir_taxa: updateNotificationDto.unir_taxa,
				observacoes: updateNotificationDto.observacoes,
				layout_id: updateNotificationDto.layout_id,
				doc_gerado: updateNotificationDto.doc_gerado,
			},
			where: { id },
		});

		if (updateNotificationDto.arquivos_ids?.length) {
			await this.arquivoService.removeFiles(
				updateNotificationDto.arquivos_ids,
				user_id,
			);
		}

		return {
			success: true,
			message: 'Notificação atualizada com sucesso.',
			data: { ...notificacaoResult },
		};
	}

	async dataToHandle(id: number) {
		const dataToPrint: {
			[key: string]:
				| number
				| string
				| Date
				| Array<any>
				| boolean
				| undefined;
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

		const condominio: Condominium = await this.condomonioService.findOnById(
			data.unidade.condominio_id,
		);
		const setupSistema = await this.setupService.findSetupSystem(
			data.unidade.condominio.empresa_id,
		);
		const setupNotificacao = await this.setupService.findSetupNotification(
			condominio.id,
		);
		const sindico = condominio.condominio_administracao?.filter(
			(item) => item.cargo.sindico,
		);

		const empresa = await this.prisma.pessoa.findUnique({
			select: {
				nome: true,
				temas: {
					select: {
						logo: true,
					},
				},
			},
			where: {
				id: setupSistema.empresa_id,
			},
		});

		dataToPrint.empresa_logo = `<img src="${
			empresa.temas.length && empresa.temas[0].logo
				? empresa.temas[0].logo
				: defaultLogo
		}" width="150"/> `;
		dataToPrint.nome_sindico = sindico?.length ? sindico[0].nome : '';
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
		dataToPrint.valor_multa_notificacao = new Intl.NumberFormat('pt-BR', {
			currency: 'BRL',
			minimumFractionDigits: 2,
		}).format(data.valor_multa);
		dataToPrint.competencia_multa_notificacao = data.competencia_multa;
		dataToPrint.unir_taxa_multa_notificacao = data.unir_taxa
			? 'Sim'
			: 'Não';
		dataToPrint.vencimento_multa_notificacao = data.vencimento_multa
			? new Intl.DateTimeFormat('pt-BR', {
					dateStyle: 'short',
			  }).format(data.vencimento_multa)
			: 'Unido a taxa de condomínio';

		const condomino = data.unidade.condominos.filter(
			(item) => item.condomino.id == data.pessoa_id,
		)[0];

		dataToPrint.tipo_responsavel_notificado = condomino.tipo.descricao;
		dataToPrint.responsavel_notificado = condomino.condomino.nome;

		return dataToPrint;
	}

	async dataAnexos(id: number) {
		const dataToPrint: {
			[key: string]:
				| number
				| string
				| Date
				| Array<any>
				| boolean
				| undefined;
		} = {};
		const files = await this.prisma.arquivo.findMany({
			where: {
				referencia_id: id,
				origem: 1,
				tipo: { not: { contains: 'pdf' } },
				ativo: true,
			},
		});

		const hasPdf = await this.prisma.arquivo.findMany({
			where: {
				referencia_id: id,
				origem: 1,
				tipo: { contains: 'pdf' },
				ativo: true,
			},
		});
		dataToPrint.anexos = files;
		dataToPrint.hasAnexos =
			(hasPdf && hasPdf.length) || (files && files.length);
		return dataToPrint;
	}

	async getPDFFiles(id: number) {
		const filesObj = await this.prisma.arquivo.findMany({
			where: {
				referencia_id: id,
				origem: 1,
				tipo: { contains: 'pdf' },
				ativo: true,
			},
		});

		if (filesObj && filesObj.length) {
			const files: Buffer[] = [];
			for await (const file of filesObj) {
				const fl = await this.s3Service.download(file.key);
				files.push(Buffer.concat([fl]));
			}

			return files;
		}
		return [];
	}

	async findByUnidade(
		unidade_id: number,
		filtro: FilterNotificationDto,
		page?: number,
	) {
		const notificationList = await this.prisma.notificacao.findMany({
			select: {
				id: true,
				data_emissao: true,
			},
			where: {
				unidade_id,
				unidade: filtro.condominos_ids
					? {
							condominio: {
								id: { in: filtro.condominos_ids },
							},
					  }
					: undefined,
				ativo: true,
				tipo_infracao_id: filtro.tipo_infracao_id
					? filtro.tipo_infracao_id
					: undefined,
				tipo_registro: filtro.tipo_registro
					? filtro.tipo_registro
					: undefined,
				data_emissao: filtro.data_emissao
					? {
							gte:
								setCustomHour(filtro.data_emissao[0]) ||
								undefined,
							lte:
								setCustomHour(
									filtro.data_emissao[1],
									23,
									59,
									59,
								) || undefined,
					  }
					: undefined,
				data_infracao: filtro.data_infracao
					? {
							gte:
								setCustomHour(filtro.data_infracao[0]) ||
								undefined,
							lte:
								setCustomHour(
									filtro.data_infracao[1],
									23,
									59,
									59,
								) || undefined,
					  }
					: undefined,
			},
		});

		const setup_condominio = await this.prisma.notificacaoSetup.findFirst({
			select: { condominio_id: true, prazo_interpor_recurso: true },
			where: {
				condominio: {
					unidades_condominio: {
						some: {
							id: unidade_id,
						},
					},
				},
			},
		});

		const notifications_ids: number[] = [];
		const notifications_ids_expired: number[] = [];

		const dia = new Date();

		dia.setDate(
			new Date().getDate() -
				(setup_condominio?.prazo_interpor_recurso || 0),
		);

		if (filtro.prazo_recurso && !!setup_condominio) {
			notificationList.forEach((notification) => {
				if (
					filtro.prazo_recurso == 1 &&
					notification.data_emissao >= setCustomHour(dia)
				) {
					notifications_ids.push(notification.id);
				}

				if (
					filtro.prazo_recurso == 2 &&
					notification.data_emissao < setCustomHour(dia)
				) {
					notifications_ids_expired.push(notification.id);
					notifications_ids.push(notification.id);
				}
			});
		} else {
			notificationList.forEach((notification) => {
				if (notification.data_emissao < setCustomHour(dia)) {
					notifications_ids_expired.push(notification.id);
				}

				notifications_ids.push(notification.id);
			});
		}

		const notifications = await this.prisma.notificacao.findMany({
			include: {
				pessoa: { select: { nome: true } },
				tipo_infracao: { select: { descricao: true } },
			},
			where: {
				id: {
					in: notifications_ids,
				},
			},
			skip: page ? (page - 1) * 10 : undefined,
			take: 10,
		});

		const total_pages = await this.prisma.notificacao.count({
			where: {
				id: {
					in: notifications_ids,
				},
			},
		});

		return {
			total_pages,
			data: notifications.map((notification) => ({
				...notification,
				prazo_recurso_vencido: notifications_ids_expired.includes(
					notification.id,
				),
			})),
		};
	}

	async inativate(id: number) {
		return this.prisma.notificacao.update({
			data: { ativo: false },
			where: { id },
		});
	}

	async updateLayoutUsado(id: number, doc_gerado: string) {
		return this.prisma.notificacao.update({
			data: { doc_gerado },
			where: { id },
		});
	}

	async findEmailsById(notification_id: number, empresa_id: number) {
		const notification = await this.findOneById(notification_id);

		if (!notification || Number.isNaN(notification_id))
			throw new BadRequestException('Notificação não encontrada');

		const administration =
			await this.prisma.condomimioAdministracao.findMany({
				select: {
					id: true,
					nome: true,
					cargo: {
						select: {
							nome: true,
						},
					},
				},
				where: {
					condominio: {
						unidades_condominio: {
							some: {
								notificacoes: {
									some: {
										id: notification_id,
									},
								},
							},
						},
						empresa_id,
					},
				},
			});

		const administrationContacts = await this.prisma.contato.findMany({
			select: {
				id: true,
				contato: true,
				descricao: true,
				referencia_id: true,
			},
			where: {
				origem: Contact.ADMINISTRACAO_CONDOMINIO,
				referencia_id: {
					in: administration.map((adm) => adm.id),
				},
				tipo: ContactType.EMAIL,
			},
		});

		const residents = await this.prisma.pessoa.findMany({
			select: {
				id: true,
				nome: true,
				unidades: {
					select: {
						tipo: {
							select: {
								descricao: true,
							},
						},
					},
				},
			},
			where: {
				ativo: true,
				unidades: {
					some: {
						unidade_id: notification.unidade_id,
					},
				},
			},
		});

		const residentsContacts = await this.prisma.contato.findMany({
			select: {
				id: true,
				contato: true,
				descricao: true,
				referencia_id: true,
			},
			where: {
				origem: Contact.PESSOA,
				referencia_id: {
					in: residents.map((resident) => resident.id),
				},
				tipo: ContactType.EMAIL,
			},
		});

		return [
			...administrationContacts.map((contact) => {
				const admData = administration.find(
					(adm) => adm.id == contact.referencia_id,
				);

				return {
					...contact,
					referencia_id: undefined,
					proprietario: {
						...admData,
						cargo: undefined,
						descricao: admData.cargo.nome,
						tipo: Contact.ADMINISTRACAO_CONDOMINIO,
					},
				};
			}),
			...residentsContacts.map((contact) => {
				const residentData = residents.find(
					(condomino) => condomino.id == contact.referencia_id,
				);

				return {
					...contact,
					referencia_id: undefined,
					proprietario: {
						...residentData,
						unidades: undefined,
						descricao: residentData.unidades[0].tipo.descricao,
						tipo: Contact.PESSOA,
					},
				};
			}),
		];
	}

	async sendMail(
		notification_id: number,
		sendMailNotificationDto: SendMailNotificationDto,
		empresa_id: number,
	) {
		const notification = await this.findOneById(notification_id);

		if (!notification || Number.isNaN(notification_id))
			throw new BadRequestException('Notificação não encontrada');

		if (
			!sendMailNotificationDto.contatos_ids.length &&
			!sendMailNotificationDto.emails.length
		)
			throw new BadRequestException(
				'Nenhum endereço de email selecionado. Por favor, selecione um endereço',
			);

		const contacts = await this.findEmailsById(notification_id, empresa_id);
		const contactsList = [
			...contacts
				.filter(
					(contact) =>
						sendMailNotificationDto?.contatos_ids &&
						sendMailNotificationDto.contatos_ids.includes(
							contact.id,
						),
				)
				.map((contact) => contact.contato),
			...sendMailNotificationDto?.emails,
		];

		const setupEmail = await this.prisma.emailSetup.findFirst({
			where: {
				empresa_id: empresa_id,
				padrao: true,
			},
		});

		const link = this.externalJtwService.generateURLExternal({
			origin: 'notificacoes',
			data: { id: notification_id },
		});

		await Promise.all(
			contactsList.map((contact) =>
				this.emailService.send({
					to: contact,
					from: process.env.EMAIL_SEND_PROVIDER,
					subject: `Notificação ${notification_id} emitida`,
					html: `
						<p>Nova notificação foi emitida para a unidade ${notification.unidade.codigo}</p>
						<p>Segue o link para visualizar os dados da notificação</p>
						<a href="${link}">${link}</a>
						`,
					setup: {
						MAIL_SMTP_HOST: setupEmail.host,
						MAIL_SMTP_PORT: setupEmail.port,
						MAIL_SMTP_USER: setupEmail.user,
						MAIL_SMTP_PASS: setupEmail.password,
						MAIL_SMTP_SECURE: setupEmail.secure,
					},
				}),
			),
		);
	}

	async generateDoc(layout_id: number, empresa_id: number, id: number) {
		const layoutPadrao = await this.layoutNotificationServe.findOne(
			layout_id,
			empresa_id,
		);

		const layout = this.layoutService.replaceLayoutVars(
			layoutPadrao.modelo,
		);

		const notificacao = await this.findOneById(id);
		const dataToPrint = await this.dataToHandle(notificacao.id);

		const html = this.handleBarService.compile(layout, dataToPrint);

		return {
			success: true,
			data: await this.updateLayoutUsado(notificacao.id, html),
			message: '',
		};
	}
}
