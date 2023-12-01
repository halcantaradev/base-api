import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { CreateProtocolDto } from './dto/create-protocol.dto';
import { UpdateProtocolDto } from './dto/update-protocol.dto';
import { Prisma } from '@prisma/client';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { FiltersProtocolDto } from './dto/filters-protocol.dto';
import { CreateDocumentProtocolDto } from './dto/create-document-protocol.dto';
import { UpdateDocumentProtocolDto } from './dto/update-document-protocol.dto';
import { Pagination } from 'src/shared/entities/pagination.entity';
import { setCustomHour } from 'src/shared/helpers/date.helper';
import { FiltersProtocolCondominiumDto } from './dto/filters-protocol-condominium.dto';
import { PersonService } from '../person/person.service';
import { EmailService } from 'src/shared/services/email.service';
import { SendEmailProtocolDto } from './dto/send-email-protocol.dto';
import { HandlebarsService } from 'src/shared/services/handlebars.service';
import { LayoutConstsService } from 'src/shared/services/layout-consts.service';
import { PdfService } from 'src/shared/services/pdf.service';
import { ExternalJwtService } from 'src/shared/services/external-jwt/external-jwt.service';
import { Contact } from 'src/shared/consts/contact.const';
import { ContactType } from 'src/shared/consts/contact-type.const';
import { NotificationEventsService } from '../notification-events/notification-events.service';
import { Protocol } from './entities/protocol.entity';
import { FilesOrigin } from 'src/shared/consts/file-origin.const';
import { TypeNotificationProtocol } from './enums/type-notification-protocol.enum';
import { defaultLogo } from 'src/shared/consts/default-logo.base64';
import { RejectDocumentProtocolDto } from './dto/reject-document-protocol.dto';
import { CreateVirtualPackageProtocolDto } from './dto/create-virtual-package-protocol.dto';
import { ProtocolSituation } from 'src/shared/consts/protocol-situation.const';
import { VirtualPackageSituation } from 'src/shared/consts/virtual-package-situation.const';
import { VirtualPackageDocumentSituation } from 'src/shared/consts/virtual-package-document-situation.const';
import { ProtocolHistorySituation } from 'src/shared/consts/protocol-history-situation.const';
import { CancelProtocolDto } from './dto/cancel-protocol.dto';

@Injectable()
export class ProtocolService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly pdfService: PdfService,
		private readonly emailService: EmailService,
		private readonly pessoaService: PersonService,
		private readonly layoutService: LayoutConstsService,
		private readonly handleBarService: HandlebarsService,
		private readonly externalJtwService: ExternalJwtService,
		private readonly notificationEventsService: NotificationEventsService,
	) {}

	select: Prisma.ProtocoloSelect = {
		id: true,
		tipo: true,
		protocolo_malote: true,
		origem_usuario: {
			select: {
				id: true,
				nome: true,
			},
		},
		origem_departamento: {
			select: {
				id: true,
				nome: true,
			},
		},
		documentos: {
			select: {
				id: true,
				created_at: true,
				protocolo: {
					select: {
						origem_usuario: {
							select: {
								nome: true,
							},
						},
					},
				},

				tipo_documento: {
					select: {
						nome: true,
					},
				},
				retorna: true,
				vencimento: true,
				rejeitado: true,
				motivo_rejeitado: true,
				valor: true,
				fila_geracao_malote: {
					where: {
						excluido: false,
					},
				},
				malote_virtual_id: true,
				malotes_documento: {
					select: {
						malote_virtual: {
							select: {
								id: true,
								situacao: true,
							},
						},
					},
					where: {
						excluido: false,
					},
				},
				discriminacao: true,
				data_aceite: true,
				aceite_usuario: {
					select: {
						nome: true,
					},
				},
				aceito: true,
				condominio: {
					select: {
						id: true,
						nome: true,
					},
				},
			},
			where: {
				excluido: false,
			},
		},
		destino_usuario: {
			select: {
				id: true,
				nome: true,
			},
		},
		destino_departamento: {
			select: {
				id: true,
				nome: true,
				externo: true,
			},
		},
		retorna_malote_vazio: true,
		ativo: true,
		situacao: true,
		motivo_cancelado: true,
		finalizado: true,
		data_finalizado: true,
		created_at: true,
		updated_at: true,
	};

	selectDocuments: Prisma.ProtocoloDocumentoSelect = {
		id: true,
		protocolo_id: true,
		malote_virtual_id: true,
		tipo_documento: {
			select: {
				id: true,
				nome: true,
			},
		},
		aceite_usuario: {
			select: {
				id: true,
				nome: true,
			},
		},
		condominio: {
			select: {
				id: true,
				nome: true,
			},
		},
		discriminacao: true,
		observacao: true,
		retorna: true,
		valor: true,
		vencimento: true,
		data_aceite: true,
		aceito: true,
		rejeitado: true,
		created_at: true,
		updated_at: true,
	};

	async create(createProtocolDto: CreateProtocolDto, user: UserAuth) {
		let documents = [];

		if (createProtocolDto.documentos_ids) {
			documents = await this.prisma.protocoloDocumento.findMany({
				where: {
					id: { in: createProtocolDto.documentos_ids },
					malotes_documento: {
						some: {
							situacao: VirtualPackageDocumentSituation.BAIXADO,
							malote_virtual_id:
								createProtocolDto?.malote_virtual_id,
						},
					},
				},
			});

			if (!documents.length)
				throw new BadRequestException('Documentos não encontrados');
		}

		const protocol = await this.prisma.protocolo.create({
			data: {
				empresa_id: user.empresa_id,
				tipo: createProtocolDto.tipo,
				destino_departamento_id:
					createProtocolDto.destino_departamento_id,
				destino_usuario_id: createProtocolDto.destino_usuario_id,
				origem_usuario_id: user.id,
				origem_departamento_id:
					createProtocolDto.origem_departamento_id,
				retorna_malote_vazio: createProtocolDto.retorna_malote_vazio,
				protocolo_malote:
					createProtocolDto.protocolo_malote || undefined,
				ativo: true,
			},
		});

		if (createProtocolDto.documentos_ids) {
			await Promise.all(
				createProtocolDto.documentos_ids.map(async (id) => {
					let document =
						documents.find((document) => document.id === id) ||
						null;

					if (document) {
						document = await this.prisma.protocoloDocumento.create({
							data: {
								...document,
								id: undefined,
								protocolo_id: protocol.id,
								aceito: false,
								aceite_usuario_id: null,
								data_aceite: null,
								created_at: undefined,
								updated_at: undefined,
							},
						});

						const files = await this.prisma.arquivo.findMany({
							where: {
								ativo: true,
								origem: FilesOrigin.PROTOCOL,
								referencia_id: id,
							},
						});

						if (files.length) {
							await Promise.all(
								files.map(async (file) => {
									await this.prisma.arquivo.create({
										data: {
											...file,
											referencia_id: document.id,
											created_at: undefined,
											updated_at: undefined,
										},
									});
								}),
							);
						}
					}
				}),
			);
		}

		return protocol;
	}

	async findBy(
		filtersProtocolDto: FiltersProtocolDto,
		user: UserAuth,
		pagination?: Pagination,
	) {
		const protocolo_malote = filtersProtocolDto.tipo_protocolo
			? filtersProtocolDto.tipo_protocolo == 2
				? true
				: false
			: undefined;

		const protocols = await this.prisma.protocolo.findMany({
			select: this.select,
			take: !filtersProtocolDto && pagination?.page ? 20 : undefined,
			skip:
				!filtersProtocolDto && pagination?.page
					? (pagination?.page - 1) * 20
					: undefined,
			where: {
				id: !Number.isNaN(+filtersProtocolDto.id)
					? +filtersProtocolDto.id
					: undefined,
				protocolo_malote,
				finalizado:
					filtersProtocolDto.finalizado !== undefined
						? filtersProtocolDto.finalizado
						: undefined,
				destino_departamento_id:
					filtersProtocolDto.destino_departamento_ids
						? {
								in: filtersProtocolDto.destino_departamento_ids,
						  }
						: undefined,
				origem_usuario_id:
					filtersProtocolDto.origem_usuario_id || undefined,
				destino_usuario_id:
					filtersProtocolDto.destino_usuario_id || undefined,
				documentos: {
					some:
						filtersProtocolDto.condominios_ids?.length ||
						filtersProtocolDto?.aceito_por ||
						filtersProtocolDto.data_aceito?.length
							? {
									condominio_id: filtersProtocolDto
										.condominios_ids?.length
										? {
												in: filtersProtocolDto.condominios_ids,
										  }
										: undefined,
									aceite_usuario_id:
										filtersProtocolDto?.aceito_por ||
										undefined,
									data_aceite: filtersProtocolDto.data_aceito
										?.length
										? {
												lte:
													setCustomHour(
														filtersProtocolDto
															.data_aceito[1],
														23,
														59,
														59,
													) || undefined,
												gte:
													setCustomHour(
														filtersProtocolDto
															.data_aceito[0],
													) || undefined,
										  }
										: undefined,
							  }
							: undefined,
				},
				tipo: filtersProtocolDto.tipo || undefined,
				situacao: filtersProtocolDto.situacao || undefined,
				created_at: filtersProtocolDto.data_emissao
					? {
							lte:
								setCustomHour(
									filtersProtocolDto.data_emissao[1],
									23,
									59,
									59,
								) || undefined,
							gte:
								setCustomHour(
									filtersProtocolDto.data_emissao[0],
								) || undefined,
					  }
					: undefined,
				ativo: filtersProtocolDto.ativo || undefined,
				excluido: false,
				origem_departamento:
					!user.acessa_todos_departamentos ||
					filtersProtocolDto.origem_departament_ids
						? {
								id: filtersProtocolDto.origem_departament_ids
									? {
											in: filtersProtocolDto.origem_departament_ids,
									  }
									: undefined,
								usuarios: !user.acessa_todos_departamentos
									? {
											some: {
												usuario: {
													id: user.id,
												},
											},
									  }
									: undefined,
						  }
						: undefined,
			},
		});

		return Promise.all(
			protocols.map(async (protocol) => ({
				...protocol,
				documentos: await Promise.all(
					protocol.documentos.map(async (document) => ({
						...document,
						total_anexos: await this.prisma.arquivo.count({
							where: {
								referencia_id: document.id,
							},
						}),
					})),
				),
			})),
		);
	}

	async findByAccept(
		filtersProtocolDto: FiltersProtocolDto,
		user: UserAuth,
		pagination?: Pagination,
	) {
		const protocolo_malote = filtersProtocolDto.tipo_protocolo
			? filtersProtocolDto.tipo_protocolo == 2
				? true
				: false
			: undefined;

		return this.prisma.protocolo.findMany({
			select: this.select,
			take: !filtersProtocolDto && pagination?.page ? 20 : 100,
			skip:
				!filtersProtocolDto && pagination?.page
					? (pagination?.page - 1) * 20
					: undefined,
			where: {
				id: !Number.isNaN(+filtersProtocolDto.id)
					? +filtersProtocolDto.id
					: undefined,
				protocolo_malote,
				destino_departamento_id:
					filtersProtocolDto.destino_departamento_ids
						? {
								in: filtersProtocolDto.destino_departamento_ids,
						  }
						: undefined,
				origem_usuario_id:
					filtersProtocolDto.origem_usuario_id || undefined,
				destino_usuario_id:
					filtersProtocolDto.destino_usuario_id || undefined,
				documentos: {
					some: {
						condominio_id: filtersProtocolDto.condominios_ids
							?.length
							? {
									in: filtersProtocolDto.condominios_ids,
							  }
							: undefined,
						aceite_usuario_id:
							filtersProtocolDto?.aceito_por || undefined,
						data_aceite: filtersProtocolDto.data_aceito?.length
							? {
									lte:
										setCustomHour(
											filtersProtocolDto.data_aceito[1],
											23,
											59,
											59,
										) || undefined,
									gte:
										setCustomHour(
											filtersProtocolDto.data_aceito[0],
										) || undefined,
							  }
							: undefined,
					},
				},

				tipo: filtersProtocolDto.tipo || undefined,
				situacao: {
					in:
						filtersProtocolDto.situacao != null &&
						filtersProtocolDto.situacao !=
							ProtocolSituation.CANCELADO
							? [filtersProtocolDto.situacao]
							: undefined,
					notIn: [ProtocolSituation.CANCELADO],
				},
				created_at: filtersProtocolDto.data_emissao
					? {
							lte:
								setCustomHour(
									filtersProtocolDto.data_emissao[1],
									23,
									59,
									59,
								) || undefined,
							gte:
								setCustomHour(
									filtersProtocolDto.data_emissao[0],
								) || undefined,
					  }
					: undefined,
				ativo: filtersProtocolDto.ativo || undefined,
				excluido: false,
				finalizado: true,
				destino_departamento:
					!user.acessa_todos_departamentos ||
					filtersProtocolDto.destino_departamento_ids
						? {
								id: filtersProtocolDto.destino_departamento_ids
									? {
											in: filtersProtocolDto.destino_departamento_ids,
									  }
									: undefined,
								usuarios: !user.acessa_todos_departamentos
									? {
											some: {
												usuario: {
													id: user.id,
												},
											},
									  }
									: undefined,
						  }
						: undefined,
			},
		});
	}

	async findOneById(id: number, user: UserAuth) {
		const data = await this.prisma.protocolo.findFirst({
			select: this.select,
			where: {
				id,
				excluido: false,
				OR: !user.acessa_todos_departamentos
					? [
							{
								destino_departamento: {
									usuarios: {
										some: {
											usuario: {
												id: user.id,
											},
										},
									},
								},
							},
							{
								origem_departamento: {
									usuarios: {
										some: {
											usuario: {
												id: user.id,
											},
										},
									},
								},
							},
					  ]
					: undefined,
			},
		});

		return {
			success: true,
			data,
		};
	}

	findById(id: number, user: UserAuth): Promise<Protocol> {
		if (Number.isNaN(id)) {
			throw new BadRequestException('Protocolo não encontrado');
		}

		return this.prisma.protocolo.findFirst({
			select: this.select,
			where: {
				id,
				excluido: false,
				OR: [
					{
						origem_departamento: !user.acessa_todos_departamentos
							? {
									usuarios: {
										some: {
											usuario: {
												id: user.id,
											},
										},
									},
							  }
							: {
									NOT: {
										id: 0,
									},
							  },
					},
					{
						destino_departamento: {
							usuarios: {
								some: {
									usuario: {
										id: user.id,
									},
								},
							},
						},
					},
				],
			},
		});
	}

	async cancelById(
		id: number,
		cancelProtocolDto: CancelProtocolDto,
		user: UserAuth,
	): Promise<Protocol> {
		const protocol = await this.findById(id, user);

		if (!protocol || protocol.situacao != ProtocolSituation.PENDENTE)
			throw new BadRequestException('Protocolo não encontrado');

		return this.prisma.protocolo.update({
			where: {
				id,
			},
			data: {
				situacao: ProtocolSituation.CANCELADO,
				motivo_cancelado: cancelProtocolDto.motivo_cancelado,
			},
		});
	}

	async update(
		id: number,
		updateProtocolDto: UpdateProtocolDto,
		user: UserAuth,
	) {
		let protocolo = await this.findById(id, user);

		if (!protocolo || protocolo.situacao != ProtocolSituation.PENDENTE) {
			throw new BadRequestException('Protocolo não encontrado');
		}

		const protocolHasFinalized = protocolo.finalizado;

		if (!protocolo.documentos.length) {
			protocolo = await this.prisma.protocolo.update({
				data: {
					ativo: updateProtocolDto.ativo || undefined,
					finalizado: updateProtocolDto.finalizado || undefined,
					data_finalizado: updateProtocolDto.finalizado
						? new Date()
						: undefined,
				},
				where: {
					id,
				},
			});
		} else {
			protocolo = await this.prisma.protocolo.update({
				data: {
					finalizado: updateProtocolDto.finalizado || undefined,
					data_finalizado: updateProtocolDto.finalizado
						? new Date()
						: undefined,
				},
				where: {
					id,
				},
			});
		}

		if (!protocolHasFinalized && protocolo.finalizado) {
			const documents = await this.findAllDocuments(id, user);

			await this.prisma.protocoloDocumentoHistorico.createMany({
				data: documents.map((document) => ({
					documento_id: document.id,
					usuario_id: user.id,
					situacao: ProtocolHistorySituation.ENVIADO,
				})),
			});
		}

		if (protocolo) {
			this.sendNotification(
				protocolo,
				updateProtocolDto.destino_departamento_id,
				user.empresa_id,
				null,
				updateProtocolDto.finalizado
					? TypeNotificationProtocol.ATUALIZACAO_PROTOCOLO
					: TypeNotificationProtocol.NOVO_PROTOCOLO,
			);
		}

		return protocolo;
	}

	async createDocument(
		protocolo_id: number,
		createDocumentProtocolDto: CreateDocumentProtocolDto,
		user: UserAuth,
	) {
		const protocolo = await this.findById(protocolo_id, user);

		if (
			!protocolo ||
			Number.isNaN(protocolo_id) ||
			protocolo.situacao === ProtocolSituation.CANCELADO
		)
			throw new BadRequestException('Protocolo não encontrado');

		const document = await this.prisma.protocoloDocumento.create({
			data: {
				protocolo_id,
				discriminacao: createDocumentProtocolDto.discriminacao,
				observacao: createDocumentProtocolDto.observacao || null,
				retorna: createDocumentProtocolDto.retorna,
				vencimento: createDocumentProtocolDto.vencimento,
				valor: createDocumentProtocolDto.valor,
				condominio_id: createDocumentProtocolDto.condominio_id,
				tipo_documento_id: createDocumentProtocolDto.tipo_documento_id,
			},
		});

		await this.prisma.protocoloDocumentoHistorico.create({
			data: {
				documento_id: document.id,
				usuario_id: user.id,
				situacao: protocolo.finalizado
					? ProtocolHistorySituation.ENVIADO
					: ProtocolHistorySituation.CRIADO,
			},
		});

		return document;
	}

	async findAllDocuments(protocolo_id: number, user?: UserAuth) {
		const protocolo = await this.findById(protocolo_id, user);

		if (!protocolo || Number.isNaN(protocolo_id))
			throw new BadRequestException('Protocolo não encontrado');

		const documentsProtocol = await this.prisma.protocoloDocumento.findMany(
			{
				select: {
					id: true,
					created_at: true,
					protocolo: {
						select: {
							origem_usuario: {
								select: {
									nome: true,
								},
							},
						},
					},
					tipo_documento: {
						select: {
							nome: true,
						},
					},
					retorna: true,
					vencimento: true,
					rejeitado: true,
					motivo_rejeitado: true,
					valor: true,
					fila_geracao_malote: {
						where: {
							excluido: false,
						},
					},
					malote_virtual_id: true,
					malotes_documento: {
						select: {
							malote_virtual: {
								select: {
									id: true,
									situacao: true,
								},
							},
						},
						where: {
							excluido: false,
						},
					},
					discriminacao: true,
					data_aceite: true,
					aceite_usuario: {
						select: {
							nome: true,
						},
					},
					aceito: true,
					condominio: {
						select: {
							id: true,
							nome: true,
						},
					},
				},
				where: {
					protocolo_id,
					excluido: false,
				},
			},
		);

		if (!documentsProtocol) {
			throw new BadRequestException('Protocolo não encontrado');
		}

		const arquivos = await this.prisma.arquivo.findMany({
			where: {
				ativo: true,
				origem: FilesOrigin.PROTOCOL,
				referencia_id: {
					in: documentsProtocol.map((d) => d.id),
				},
			},
		});

		return documentsProtocol.map((d) => ({
			...d,
			total_anexos: arquivos.filter((a) => a.referencia_id === d.id)
				.length,
		}));
	}

	async print(protocol_id: number, user: UserAuth) {
		const data = await this.findById(protocol_id, user);

		if (!data) {
			throw new BadRequestException('Protocolo não encontrado');
		}

		const layout = this.layoutService.replaceLayoutVars(
			this.layoutService.getTemplate('protocolo.html'),
		);

		const dataToPrint = await this.dataToHandle(protocol_id);

		const protocoloFile = this.handleBarService.compile(
			layout,
			dataToPrint,
		);

		const pdf = await this.pdfService.setTitlePDF(
			`PROTOCOLO_${new Date().getTime()}`,
			await this.pdfService.getPDF(protocoloFile),
		);

		const documents = await this.findAllDocuments(protocol_id, user);

		await this.prisma.protocoloDocumentoHistorico.createMany({
			data: documents.map((document) => ({
				documento_id: document.id,
				usuario_id: user.id,
				situacao: ProtocolHistorySituation.PROTOCOLO_IMPRESSO,
			})),
		});

		return pdf;
	}

	async dataToHandle(id: number) {
		const protocol = await this.prisma.protocolo.findFirst({
			where: {
				id,
				situacao: { notIn: [ProtocolSituation.CANCELADO] },
			},
		});

		if (!protocol || Number.isNaN(id))
			throw new BadRequestException('Protocolo não encontrado');

		const total_documentos = await this.prisma.protocoloDocumento.count({
			where: {
				protocolo_id: id,
				excluido: false,
			},
		});

		const documentsProtocol = await this.prisma.protocoloDocumento.findMany(
			{
				select: {
					created_at: true,
					protocolo: {
						select: {
							origem_usuario: {
								select: {
									nome: true,
								},
							},
						},
					},
					tipo_documento: {
						select: {
							nome: true,
						},
					},
					discriminacao: true,
					data_aceite: true,
					aceite_usuario: {
						select: {
							nome: true,
						},
					},
					condominio: {
						select: {
							id: true,
							nome: true,
						},
					},
				},
				where: {
					protocolo_id: id,
					excluido: false,
				},
			},
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
				id: protocol.empresa_id,
			},
		});

		const data: any = {};

		data.data_atual_extenso = new Intl.DateTimeFormat('pt-BR', {
			dateStyle: 'long',
		}).format(new Date());

		data.numero_protocolo = protocol.id;
		data.total_documentos_protocolo = total_documentos;
		data.empresa_nome = empresa.nome || '';
		data.empresa_logo = `<img src="${
			empresa.temas.length && empresa.temas[0].logo
				? empresa.temas[0].logo
				: defaultLogo
		}" width="150"/>`;

		const condominios = [];

		documentsProtocol.forEach((item) => {
			if (!condominios[item.condominio.id]) {
				condominios[item.condominio.id] = {
					id: item.condominio.id,
					nome: item.condominio.nome,
					documents: [
						{
							emissao: item.created_at
								? new Intl.DateTimeFormat('pt-BR').format(
										item?.created_at,
								  )
								: null,
							usuario: item?.protocolo?.origem_usuario?.nome,
							tipo: item?.tipo_documento?.nome,
							protocolo_malote: protocol.protocolo_malote,
							discriminacao: item?.discriminacao,
							recebido: item.data_aceite
								? new Intl.DateTimeFormat('pt-BR').format(
										item.data_aceite,
								  )
								: null,
							recebido_por: item?.aceite_usuario?.nome,
						},
					],
				};
			} else {
				condominios[item.condominio.id].documents.push({
					emissao: item.created_at
						? new Intl.DateTimeFormat('pt-BR').format(
								item?.created_at,
						  )
						: null,
					usuario: item?.protocolo?.origem_usuario?.nome,
					tipo: item?.tipo_documento?.nome,
					protocolo_malote: protocol.protocolo_malote,
					discriminacao: item?.discriminacao,
					recebido: item.data_aceite
						? new Intl.DateTimeFormat('pt-BR').format(
								item.data_aceite,
						  )
						: null,
					recebido_por: item?.aceite_usuario?.nome,
				});
			}
		});

		data.condominios = condominios;
		return data;
	}

	async findDocumentById(
		protocolo_id: number,
		document_id: number,
		user: UserAuth,
	) {
		const protocolo = await this.findById(protocolo_id, user);

		if (!protocolo || Number.isNaN(protocolo_id))
			throw new BadRequestException('Protocolo não encontrado');

		if (Number.isNaN(document_id))
			throw new BadRequestException('Documento não encontrado');

		const document = await this.prisma.protocoloDocumento.findFirst({
			select: this.selectDocuments,
			where: {
				protocolo_id,
				id: document_id,
			},
		});

		const arquivos = await this.prisma.arquivo.findMany({
			where: {
				ativo: true,
				origem: FilesOrigin.PROTOCOL,
				referencia_id: document_id,
			},
		});

		return { ...document, arquivos };
	}

	async acceptDocuments(
		protocol_id: number,
		documents_ids: number[],
		user: UserAuth,
	) {
		const documentExists = await this.prisma.protocolo.findFirst({
			select: {
				documentos: {
					where: {
						id: {
							in: documents_ids,
						},
						aceito: false,
						rejeitado: false,
						fila_geracao_malote: {
							none: {
								documento_id: {
									in: documents_ids,
								},
								excluido: false,
							},
						},
					},
				},
			},
			where: {
				id: protocol_id,
				excluido: false,
				situacao: { notIn: [ProtocolSituation.CANCELADO] },
				destino_departamento: !user.acessa_todos_departamentos
					? {
							usuarios: {
								some: {
									usuario: {
										id: user.id,
									},
								},
							},
					  }
					: undefined,
			},
		});

		if (
			!documentExists ||
			!documentExists?.documentos ||
			!documentExists.documentos.length
		) {
			throw new BadRequestException(
				'Documento(s) informado(s) não aceitos ou não encontrados',
			);
		}

		const documents_ids_accept = documentExists.documentos.map(
			(document) => document.id,
		);

		await this.prisma.protocoloDocumento.updateMany({
			where: {
				id: {
					in: documents_ids_accept,
				},
			},
			data: {
				aceito: true,
				aceite_usuario_id: user.id,
				data_aceite: new Date(),
			},
		});

		await this.prisma.protocoloDocumentoHistorico.createMany({
			data: documents_ids_accept.map((document_id) => ({
				documento_id: document_id,
				usuario_id: user.id,
				situacao: ProtocolHistorySituation.ACEITO,
			})),
		});

		const protocolTotalDocuments =
			await this.prisma.protocoloDocumento.findMany({
				where: {
					protocolo_id: protocol_id,
					excluido: false,
					aceito: false,
				},
			});

		await this.prisma.protocolo.update({
			where: {
				id: protocol_id,
			},
			data: {
				situacao: !protocolTotalDocuments.length
					? ProtocolSituation.ACEITO
					: ProtocolSituation.ACEITO_PARCIALMENTE,
			},
		});

		return {
			success: true,
			message: 'Documento(s) aceito(s) com sucesso!',
		};
	}

	async reverseDocuments(
		protocol_id: number,
		documents_ids: number[],
		user: UserAuth,
	) {
		const documentExists = await this.prisma.protocolo.findFirst({
			select: {
				protocolo_malote: true,
				documentos: {
					include: {
						malote_virtual: {
							select: {
								id: true,
								situacao: true,
								situacao_anterior: true,
								documentos_malote: {
									select: {
										situacao: true,
										excluido: true,
									},
								},
							},
						},
					},
					where: {
						id: {
							in: documents_ids,
						},

						fila_geracao_malote: {
							none: {
								documento_id: {
									in: documents_ids,
								},
								excluido: false,
							},
						},
						OR: [
							{
								aceito: true,
								rejeitado: false,
							},
							{
								aceito: false,
								rejeitado: true,
							},
						],
					},
				},
			},
			where: {
				id: protocol_id,
				excluido: false,
				situacao: { notIn: [ProtocolSituation.CANCELADO] },
				destino_departamento: !user.acessa_todos_departamentos
					? {
							usuarios: {
								some: {
									usuario: {
										id: user.id,
									},
								},
							},
					  }
					: undefined,
			},
		});

		if (
			!documentExists ||
			!documentExists?.documentos ||
			!documentExists.documentos.length
		) {
			throw new BadRequestException(
				'Documento(s) informado(s) não aceitos, já na fila ou não encontrados',
			);
		}

		if (documentExists.protocolo_malote) {
			let canReverse = true;
			const packageNotReserse: number[] = [];

			documentExists.documentos.forEach((doc) => {
				if (
					doc.malote_virtual.documentos_malote.length !=
						doc.malote_virtual.documentos_malote.filter(
							(d) =>
								(![
									VirtualPackageDocumentSituation.BAIXADO,
									VirtualPackageDocumentSituation.NAO_RECEBIDO,
								].includes(d.situacao) &&
									!d.excluido) ||
								d.excluido,
						).length &&
					doc.malote_virtual.situacao !=
						VirtualPackageSituation.BAIXADO
				) {
					canReverse = false;
					packageNotReserse.push(doc.malote_virtual.id);
				}
			});

			if (!canReverse)
				throw new BadRequestException(
					`O(s) malote(s): ${packageNotReserse.join(
						', ',
					)}, não podem ser estornados, pois contém documentos baixados`,
				);
		}

		const documents_ids_reverse = documentExists.documentos.map(
			(document) => document.id,
		);

		await this.prisma.protocoloDocumento.updateMany({
			where: {
				id: {
					in: documents_ids_reverse,
				},
			},
			data: {
				aceito: false,
				rejeitado: false,
				motivo_rejeitado: null,
				aceite_usuario_id: null,
				data_aceite: null,
			},
		});

		await this.prisma.protocoloDocumentoHistorico.createMany({
			data: documents_ids_reverse.map((document_id) => ({
				documento_id: document_id,
				usuario_id: user.id,
				situacao: ProtocolHistorySituation.ESTORNO_ACEITE,
			})),
		});

		const protocolTotalDocuments =
			await this.prisma.protocoloDocumento.findMany({
				where: {
					protocolo_id: protocol_id,
					excluido: false,
					OR: [{ aceito: true }, { rejeitado: true }],
				},
			});

		const protocolo = await this.prisma.protocolo.update({
			where: {
				id: protocol_id,
			},
			data: {
				situacao: !protocolTotalDocuments.length
					? ProtocolSituation.PENDENTE
					: ProtocolSituation.ACEITO_PARCIALMENTE,
			},
		});

		await this.sendNotification(
			protocolo,
			protocolo.origem_departamento_id,
			user.empresa_id,
			protocolo.destino_usuario_id,
			TypeNotificationProtocol.ESTORNO_DOCUMENTO_PROTOCOLO,
		);

		return {
			success: true,
			message: 'Documento(s) estornados(s) com sucesso!',
		};
	}

	async updateDocument(
		protocolo_id: number,
		document_id: number,
		updateDocumentProtocolDto: UpdateDocumentProtocolDto,
		user: UserAuth,
		exclude = false,
	) {
		const protocolo = await this.findById(protocolo_id, user);

		if (!protocolo || Number.isNaN(protocolo_id))
			throw new BadRequestException('Protocolo não encontrado');

		if (protocolo.protocolo_malote && !exclude)
			throw new BadRequestException('Documento não pode ser alterado');

		const document = await this.findDocumentById(
			protocolo_id,
			document_id,
			user,
		);

		if (!document || Number.isNaN(document_id) || document.aceito)
			throw new BadRequestException('Documento não encontrado');

		if (protocolo.protocolo_malote && exclude) {
			if (!document.malote_virtual_id) {
				throw new BadRequestException('Malote virtual não encontrado');
			}
			const hasReceivedDocuments =
				!!(await this.prisma.maloteDocumento.findFirst({
					where: {
						id: document.malote_virtual_id,
						excluido: false,
						situacao: {
							in: [
								VirtualPackageDocumentSituation.BAIXADO,
								VirtualPackageDocumentSituation.NAO_RECEBIDO,
							],
						},
						malote_virtual: {
							situacao_anterior: {
								notIn: [
									VirtualPackageSituation.PROTOCOLADO,
									VirtualPackageSituation.BAIXADO,
								],
							},
						},
					},
				}));

			if (hasReceivedDocuments)
				throw new BadRequestException(
					'Não é possível remover, pois o malote possui documentos baixados',
				);
		}

		const documentUpdated = await this.prisma.protocoloDocumento.update({
			select: {
				vencimento: true,
				condominio: {
					select: {
						nome: true,
					},
				},
				tipo_documento: {
					select: {
						nome: true,
					},
				},
			},
			data: {
				discriminacao: updateDocumentProtocolDto.discriminacao,
				observacao: updateDocumentProtocolDto.observacao,
				condominio_id: updateDocumentProtocolDto.condominio_id,
				retorna: updateDocumentProtocolDto.retorna,
				valor: updateDocumentProtocolDto.valor,
				vencimento: updateDocumentProtocolDto.vencimento,
				tipo_documento_id: updateDocumentProtocolDto.tipo_documento_id,
				excluido: exclude,
			},
			where: {
				id: document_id,
			},
		});

		if (exclude)
			await this.prisma.protocoloDocumentoHistorico.create({
				data: {
					documento_id: document_id,
					usuario_id: user.id,
					situacao: ProtocolHistorySituation.EXCLUIDO,
				},
			});
		else if (
			document.condominio.id != updateDocumentProtocolDto.condominio_id ||
			document.discriminacao != updateDocumentProtocolDto.discriminacao ||
			document.observacao != updateDocumentProtocolDto.observacao ||
			document.retorna != updateDocumentProtocolDto.retorna ||
			document.vencimento != documentUpdated.vencimento ||
			document.valor != updateDocumentProtocolDto.valor ||
			document.tipo_documento.id !=
				updateDocumentProtocolDto.tipo_documento_id
		)
			await this.prisma.protocoloDocumentoHistorico.create({
				data: {
					documento_id: document_id,
					usuario_id: user.id,
					situacao: ProtocolHistorySituation.ATUALIZADO,
					descricao: `${
						document.condominio.id ==
						updateDocumentProtocolDto.condominio_id
							? ``
							: `Observação: ${document.condominio.nome} → ${documentUpdated.condominio.nome}<br>`
					}${
						document.discriminacao ==
						updateDocumentProtocolDto.discriminacao
							? ``
							: `Discriminação: ${document.discriminacao} → ${updateDocumentProtocolDto.discriminacao}<br>`
					}${
						document.observacao ==
						updateDocumentProtocolDto.observacao
							? ``
							: `Observação: ${document.observacao} → ${updateDocumentProtocolDto.observacao}<br>`
					}${
						document.tipo_documento.id ==
						updateDocumentProtocolDto.tipo_documento_id
							? ``
							: `Observação: ${document.tipo_documento.nome} → ${documentUpdated.tipo_documento.nome}<br>`
					}${
						document.valor == updateDocumentProtocolDto.valor
							? ``
							: `Valor: ${document.valor} → ${updateDocumentProtocolDto.valor}<br>`
					}${
						document.vencimento == documentUpdated.vencimento
							? ``
							: `Vencimento: ${document.vencimento} → ${documentUpdated.vencimento}<br>`
					}${
						document.retorna == updateDocumentProtocolDto.retorna
							? ``
							: `Necessário retornar: ${
									document.retorna ? 'SIM' : 'NÃO'
							  } → ${
									updateDocumentProtocolDto.retorna
										? 'SIM'
										: 'NÃO'
							  }<br>`
					}`,
				},
			});

		if (protocolo.protocolo_malote && exclude) {
			const virtualPackage = await this.prisma.maloteVirtual.findFirst({
				select: {
					situacao: true,
					situacao_anterior: true,
					protocolado_baixado: true,
				},
				where: {
					id: document.malote_virtual_id,
				},
			});

			await this.prisma.maloteVirtual.update({
				data: {
					situacao:
						virtualPackage.protocolado_baixado &&
						[
							VirtualPackageSituation.PROTOCOLADO,
							VirtualPackageSituation.BAIXADO,
						].includes(virtualPackage.situacao)
							? undefined
							: virtualPackage.situacao_anterior,
					situacao_anterior:
						virtualPackage.protocolado_baixado &&
						[
							VirtualPackageSituation.PROTOCOLADO,
							VirtualPackageSituation.BAIXADO,
						].includes(virtualPackage.situacao)
							? undefined
							: null,
					protocolado_baixado: false,
				},
				where: {
					id: document.malote_virtual_id,
				},
			});
		}

		return documentUpdated;
	}

	async findAllCondominiums(
		filtersProtocolCondominiumDto: FiltersProtocolCondominiumDto,
		condominiums: number[],
		user: UserAuth,
	) {
		const departamento_origem = await this.prisma.departamento.findFirst({
			where: {
				id: filtersProtocolCondominiumDto.departamento_origem_id,
				empresa_id: user.empresa_id,
			},
		});

		const departamento_destino = await this.prisma.departamento.findFirst({
			where: {
				id: filtersProtocolCondominiumDto.departamento_destino_id,
				empresa_id: user.empresa_id,
			},
		});

		if (!departamento_origem && !departamento_destino) return [];

		return (
			await this.pessoaService.findAll(
				'condominio',
				{},
				{
					id:
						(departamento_origem.nac || departamento_destino.nac) &&
						!user.acessa_todos_departamentos
							? {
									in: condominiums,
							  }
							: undefined,
					nome: filtersProtocolCondominiumDto.busca
						? {
								contains: filtersProtocolCondominiumDto.busca,
								mode: 'insensitive',
						  }
						: undefined,
					departamentos_condominio: {
						some:
							departamento_origem.nac || departamento_destino.nac
								? {
										OR: [
											{
												departamento_id:
													departamento_origem.nac
														? filtersProtocolCondominiumDto.departamento_origem_id
														: undefined,
											},
											{
												departamento_id:
													departamento_destino.nac
														? filtersProtocolCondominiumDto.departamento_destino_id
														: undefined,
											},
										],
								  }
								: {},
					},
					empresa_id: user.empresa_id,
					ativo: true,
				},
			)
		).data;
	}

	async findEmails(protocolo_id: number, user: UserAuth) {
		const protocolo = await this.findById(protocolo_id, user);

		if (!protocolo || Number.isNaN(protocolo_id))
			throw new BadRequestException('Protocolo não encontrado');

		const condominios = await this.prisma.protocoloDocumento.findMany({
			select: {
				condominio: {
					select: {
						id: true,
						nome: true,
						condominio_administracao: {
							select: {
								id: true,
								nome: true,
							},
						},
					},
				},
			},
			distinct: ['condominio_id'],
			where: {
				protocolo_id,
				excluido: false,
			},
		});

		const administracao_ids = [];

		condominios.forEach((condominio) => {
			administracao_ids.push(
				...condominio.condominio.condominio_administracao.map(
					(adm) => adm.id,
				),
			);
		});

		const contatos = await this.prisma.contato.findMany({
			select: {
				id: true,
				contato: true,
				tipo: true,
				descricao: true,
				referencia_id: true,
			},
			where: {
				origem: Contact.ADMINISTRACAO_CONDOMINIO,
				referencia_id: {
					in: administracao_ids,
				},
				tipo: ContactType.EMAIL,
			},
		});

		return condominios.map((condominio) => ({
			...condominio.condominio,
			condominio_administracao: undefined,
			contatos: contatos
				.filter((contato) =>
					condominio.condominio.condominio_administracao
						.map((adm) => adm.id)
						.includes(contato.referencia_id),
				)
				.map((contato) => ({
					...contato,
					referencia_id: undefined,
					proprietario:
						condominio.condominio.condominio_administracao.find(
							(proprietario) =>
								proprietario.id == contato.referencia_id,
						),
				})),
		}));
	}

	async sendMail(
		protocolo_id: number,
		sendEmailProtocolDto: SendEmailProtocolDto,
		user: UserAuth,
	) {
		const protocolo = await this.findById(protocolo_id, user);

		if (!protocolo || Number.isNaN(protocolo_id))
			throw new BadRequestException('Protocolo não encontrado');

		const documentos = await this.prisma.protocoloDocumento.findMany({
			select: {
				discriminacao: true,
				condominio: {
					select: {
						id: true,
						nome: true,
						condominio_administracao: {
							select: {
								id: true,
								nome: true,
							},
						},
					},
				},
			},
			distinct: ['condominio_id'],
			where: {
				protocolo_id,
				condominio_id: sendEmailProtocolDto.condominio_id,
				excluido: false,
			},
		});

		const administracao_ids = [];

		documentos.forEach((documento) => {
			administracao_ids.push(
				...documento.condominio.condominio_administracao.map(
					(adm) => adm.id,
				),
			);
		});

		const contatos = await this.prisma.contato.findMany({
			select: {
				contato: true,
			},
			distinct: ['contato'],
			where: {
				id: {
					in: sendEmailProtocolDto.contatos_ids,
				},
				origem: Contact.ADMINISTRACAO_CONDOMINIO,
				referencia_id: {
					in: administracao_ids,
				},
				tipo: ContactType.EMAIL,
			},
		});

		const setupEmail = await this.prisma.emailSetup.findFirst({
			where: {
				empresa_id: user.empresa_id,
				padrao: true,
			},
		});

		const link = this.externalJtwService.generateURLExternal({
			origin: 'protocolos',
			data: { id: protocolo_id },
		});

		await Promise.all(
			contatos.map((contato) =>
				this.emailService.send({
					to: contato.contato,
					from: process.env.EMAIL_SEND_PROVIDER,
					subject: `Protocolo ${protocolo_id} enviado para um novo setor`,
					html: `
					<p>Novo protocolo de envio de documentos gerado</p>
					<p>Segue o link para visualizar os dados do protocolo</p> 
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

		return;
	}

	async sendNotification(
		protocolo: Protocol,
		departamento_id: number,
		empresa_id: number,
		usuario_id: number,
		tipo: TypeNotificationProtocol = TypeNotificationProtocol.NOVO_PROTOCOLO,
	) {
		const department = await this.prisma.departamento.findFirst({
			select: {
				id: true,
				nome: true,
			},
			where: {
				id: departamento_id,
			},
		});

		let notification;

		switch (tipo) {
			case TypeNotificationProtocol.NOVO_PROTOCOLO:
				notification = {
					titulo: 'Novo Protocolo',
					conteudo: `Novo protocolo enviado para o departamento ${department.nome}, clique aqui para visualizar`,
					rota: `protocolos/detalhes/${protocolo.id}`,
				};
				break;
			case TypeNotificationProtocol.ATUALIZACAO_PROTOCOLO:
				notification = {
					titulo: `Protocolo ${protocolo.id} foi atualizado`,
					conteudo: `As informações do protocolo enviado para o departamento ${department.nome} foram atualizadas, clique aqui para visualizar`,
					rota: `protocolos/detalhes/${protocolo.id}`,
				};
				break;
			case TypeNotificationProtocol.ESTORNO_DOCUMENTO_PROTOCOLO:
				notification = {
					titulo: `Protocolo ${protocolo.id} teve um estorno`,
					conteudo: `Documentos foram estornados pelo departamento de destino, clique aqui para visualizar`,
					rota: `protocolos/detalhes/${protocolo.id}`,
				};
				break;
			case TypeNotificationProtocol.REJEITADO_DOCUMENTO_PROTOCOLO:
				notification = {
					titulo: `Protocolo ${protocolo.id} foi rejeitado`,
					conteudo: `Documentos foram rejeitados pelo departamento de destino, clique aqui para visualizar`,
					rota: `protocolos/detalhes/${protocolo.id}`,
				};
				break;
		}

		if (!usuario_id) {
			await this.notificationEventsService.sendNotificationByDepartment({
				departamento_id: department.id,
				empresa_id: empresa_id,
				notification,
			});
		} else {
			await this.notificationEventsService.sendNotificationByUser({
				usuario_id: usuario_id,
				empresa_id: empresa_id,
				notification,
			});
		}
	}

	async rejectDocuments(
		protocolo_id: number,
		body: RejectDocumentProtocolDto,
		user: UserAuth,
	) {
		if (Number.isNaN(protocolo_id)) {
			throw new BadRequestException('Protocolo não encontrado');
		}

		if (!body.documentos_ids.length) {
			throw new BadRequestException('Nenhum documento encontrado');
		}

		const documentsExists = await this.prisma.protocoloDocumento.findMany({
			where: {
				protocolo_id,
				rejeitado: false,
				excluido: false,
				aceito: false,
				id: {
					in: body.documentos_ids,
				},
				protocolo: {
					excluido: false,
					situacao: { notIn: [ProtocolSituation.CANCELADO] },
					destino_departamento: !user.acessa_todos_departamentos
						? {
								usuarios: {
									some: {
										usuario: {
											id: user.id,
										},
									},
								},
						  }
						: undefined,
				},
			},
		});

		if (!documentsExists?.length) {
			throw new BadRequestException(
				'Os documentos enviados são inválidos, somente documentos pendentes podem ser rejeitados!',
			);
		}

		await this.prisma.protocoloDocumento.updateMany({
			where: {
				protocolo_id,
				rejeitado: false,
				excluido: false,
				aceito: false,
				id: {
					in: documentsExists.map((document) => document.id),
				},
			},
			data: {
				rejeitado: true,
				motivo_rejeitado: body.motivo_rejeitado,
			},
		});

		await this.prisma.protocoloDocumentoHistorico.createMany({
			data: documentsExists.map((document) => ({
				documento_id: document.id,
				usuario_id: user.id,
				situacao: ProtocolHistorySituation.REJEITADO,
				descricao: body.motivo_rejeitado,
			})),
		});

		const protocolTotalDocuments = await this.prisma.protocolo.findFirst({
			where: {
				id: protocolo_id,
				documentos: {
					every: {
						OR: [
							{ excluido: false, rejeitado: true },
							{ excluido: true },
						],
					},
				},
			},
		});

		let protocolo;

		if (protocolTotalDocuments) {
			protocolo = await this.prisma.protocolo.update({
				where: {
					id: protocolo_id,
				},
				data: {
					situacao: ProtocolSituation.RECUSADO,
				},
			});
		} else {
			protocolo = await this.prisma.protocolo.findFirst({
				where: {
					id: protocolo_id,
					excluido: false,
					situacao: { notIn: [ProtocolSituation.CANCELADO] },
				},
			});
		}

		await this.sendNotification(
			protocolo,
			protocolo.origem_departamento_id,
			user.empresa_id,
			protocolo.destino_usuario_id,
			TypeNotificationProtocol.REJEITADO_DOCUMENTO_PROTOCOLO,
		);

		return {
			success: true,
			message: 'Os documento(s) foram rejeitados!',
		};
	}

	async createProtocolVirtualPackage(
		protocolo_id: number,
		createVirtualPackageProtocolDto: CreateVirtualPackageProtocolDto,
		user: UserAuth,
	) {
		const protocolo = await this.prisma.protocolo.findFirst({
			where: {
				id: protocolo_id,
				excluido: false,
				situacao: { notIn: [ProtocolSituation.CANCELADO] },
			},
		});

		if (!protocolo) {
			throw new BadRequestException('Protocolo não encontrado');
		}

		const virtualPackageAlreadyExist =
			await this.prisma.protocoloDocumento.findMany({
				where: {
					excluido: false,
					malote_virtual_id: {
						in: createVirtualPackageProtocolDto.malotes_virtuais_ids,
					},
				},
			});

		const virtualPackages = await this.prisma.maloteVirtual.findMany({
			include: {
				malote_fisico: true,
			},
			where: {
				id: {
					in: createVirtualPackageProtocolDto.malotes_virtuais_ids,
				},
				documentos_protocolo: virtualPackageAlreadyExist.length
					? {
							some: {
								malote_virtual_id: {
									notIn: virtualPackageAlreadyExist.map(
										(document) =>
											document.malote_virtual_id,
									),
								},
							},
					  }
					: undefined,
				condominio: {
					departamentos_condominio: {
						some: {
							departamento_id: protocolo.destino_departamento_id,
						},
					},
				},
				OR: [
					{
						situacao: {
							in: [VirtualPackageSituation.RETORNADO],
						},
					},
					{
						situacao: VirtualPackageSituation.BAIXADO,
						documentos_malote: {
							every: {
								OR: [
									{
										situacao: {
											in: [
												VirtualPackageDocumentSituation.BAIXADO,
												VirtualPackageDocumentSituation.NAO_RECEBIDO,
											],
										},
									},
									{ excluido: false },
								],
							},
						},
					},
				],
				excluido: false,
				empresa_id: user.empresa_id,
			},
		});

		if (!virtualPackages.length) {
			throw new BadRequestException(
				'Malote(s) informado(s) não pode(m) ser utilizado(s)',
			);
		}

		virtualPackages.map(async (virtualPackage) => {
			await this.prisma.protocoloDocumento.create({
				data: {
					protocolo_id,
					discriminacao: `Malote Virtual: ${
						virtualPackage.id
					}; Malote Físico: ${
						virtualPackage.malote_fisico?.codigo || 'N/A'
					}`,
					observacao: '',
					retorna: false,
					condominio_id: virtualPackage.condominio_id,
					malote_virtual_id: virtualPackage.id,
				},
			});

			await this.prisma.maloteVirtual.update({
				data: {
					situacao_anterior:
						virtualPackage.situacao !==
						VirtualPackageSituation.BAIXADO
							? virtualPackage.situacao
							: undefined,
					situacao:
						virtualPackage.situacao !==
						VirtualPackageSituation.BAIXADO
							? VirtualPackageSituation.PROTOCOLADO
							: undefined,
					protocolado_baixado:
						virtualPackage.situacao ==
						VirtualPackageSituation.BAIXADO,
				},
				where: {
					id: virtualPackage.id,
				},
			});
		});
	}
}
