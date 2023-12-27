import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { VirtualPackageType } from 'src/shared/consts/report-virtual-package-tyoe.const';
import { Pagination } from 'src/shared/entities/pagination.entity';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { setCustomHour } from 'src/shared/helpers/date.helper';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { CreateProtocolVirtualPackageDto } from './dto/create-new-protocol-virtual-package.dto';
import { CreateVirtualPackageDto } from './dto/create-virtual-package.dto';
import { FiltersSearchVirtualPackageDto } from './dto/filters-search-virtual-package.dto';
import { FiltersVirtualPackageDto } from './dto/filters-virtual-package.dto';
import { ReceivePackageVirtualPackageDto } from './dto/receive-package-virtual-package.dto';
import { ReceiveVirtualPackageDto } from './dto/receive-virtual-package.dto';
import { ReverseReceiveVirtualPackageDto } from './dto/reverse-receive-virtual-package.dto';
import { ReverseVirtualPackageDto } from './dto/reverse-virtual-package.dto';
import { CreateNewDocumenteProtocolVirtualPackageDto } from './dto/create-new-document-protocol-virtual-package.dto';
import { VirtualPackageDocumentSituation } from 'src/shared/consts/virtual-package-document-situation.const';
import { VirtualPackageSituation } from 'src/shared/consts/virtual-package-situation.const';
import { ProtocolSituation } from 'src/shared/consts/protocol-situation.const';
import { ProtocolHistorySituation } from 'src/shared/consts/protocol-history-situation.const';
import { FilesOrigin } from 'src/shared/consts/file-origin.const';

@Injectable()
export class VirtualPackageService {
	constructor(private readonly prisma: PrismaService) {}

	async create(
		createVirtualPackageDto: CreateVirtualPackageDto,
		user: UserAuth,
	) {
		if (createVirtualPackageDto.malote_fisico_id) {
			const hasMaloteFisico = await this.prisma.malotesFisicos.findFirst({
				where: {
					id: createVirtualPackageDto.malote_fisico_id,
					disponivel: false,
				},
			});

			if (hasMaloteFisico)
				throw new BadRequestException(
					'O malote fisico informado não pode ser usado!',
				);
		}

		const daysSelected = {
			dom: undefined,
			seg: undefined,
			ter: undefined,
			qua: undefined,
			qui: undefined,
			sex: undefined,
			sab: undefined,
		};

		Object.keys(daysSelected).map((key, index) => {
			if (index == createVirtualPackageDto.dia - 1)
				daysSelected[key] = true;
		});

		const documents = await this.prisma.protocoloDocumento.findMany({
			select: {
				id: true,
			},
			where: {
				pessoa_id: createVirtualPackageDto.condominio_id,
				pessoa: {
					setup_rotas: {
						rota: daysSelected,
					},
				},
				fila_geracao_malote: {
					some: {
						gerado: false,
						empresa_id: user.empresa_id,
						excluido: false,
					},
				},
			},
			orderBy: {
				pessoa_id: 'asc',
			},
		});

		if (!documents.length)
			throw new BadRequestException('Documentos não encontrados');

		const malote = await this.prisma.maloteVirtual.create({
			data: {
				usuario_id: user.id,
				empresa_id: user.empresa_id,
				condominio_id: createVirtualPackageDto.condominio_id,
				malote_fisico_id: createVirtualPackageDto.malote_fisico_id,
				lacre_saida: createVirtualPackageDto.lacre_saida,
				lacre_retorno: createVirtualPackageDto.lacre_retorno,
				documentos_malote: {
					createMany: {
						data: documents.map((document) => ({
							documento_id: document.id,
						})),
					},
				},
			},
		});

		await this.prisma.documentoFilaGeracao.updateMany({
			data: {
				gerado: true,
			},
			where: {
				documento_id: { in: documents.map((document) => document.id) },
				gerado: false,
				empresa_id: user.empresa_id,
			},
		});

		await this.prisma.protocoloDocumentoHistorico.createMany({
			data: documents.map((document) => ({
				documento_id: document.id,
				usuario_id: user.id,
				situacao: ProtocolHistorySituation.ENVIADO_MALOTE,
				descricao: `Malote ${malote.id}`,
			})),
		});

		if (malote?.malote_fisico_id) {
			await this.prisma.malotesFisicos.update({
				data: { disponivel: false },
				where: { id: malote.malote_fisico_id },
			});
		}

		return;
	}

	async findById(empresa_id: number, id: number) {
		if (Number.isNaN(id))
			throw new BadRequestException('Malote não encontrado');

		const arquivos = await this.prisma.arquivo.findMany({
			where: {
				ativo: true,
				origem: FilesOrigin.VIRTUAL_PACKAGE,
				referencia_id: id,
			},
		});

		const virtualPackage = await this.prisma.maloteVirtual.findFirst({
			select: {
				id: true,
				situacao: true,
				data_saida: true,
				protocolado_baixado: true,
				condominio: {
					select: {
						nome: true,
						setup_rotas: {
							select: { motoqueiro: { select: { nome: true } } },
						},
					},
				},
				usuario: { select: { nome: true } },
				malote_fisico: { select: { codigo: true } },
				lacre_saida: true,
				lacre_retorno: true,
				documentos_malote: {
					select: {
						id: true,
						situacao: true,
						justificativa: true,
						excluido: true,
						documento: {
							include: {
								tipo_documento: {
									select: {
										id: true,
										nome: true,
									},
								},
							},
						},
					},
					where: {
						excluido: false,
					},
				},
			},
			where: {
				id,
				empresa_id,
				excluido: false,
			},
		});

		return { ...virtualPackage, arquivos: arquivos };
	}

	async findAllPhysicalPackage(empresa_id: number) {
		const data = await this.prisma.malotesFisicos.findMany({
			select: {
				id: true,
				codigo: true,
				alerta: true,
			},
			where: {
				empresa_id,
				disponivel: true,
				ativo: true,
				excluido: false,
			},
		});

		return data;
	}

	async validateSeal(seal: string): Promise<boolean> {
		const validation = await this.prisma.maloteVirtual.findFirst({
			where: {
				OR: [
					{
						lacre_saida: seal,
					},
					{
						lacre_retorno: seal,
					},
				],
				excluido: false,
			},
		});

		return !!validation;
	}

	async report(user: UserAuth, filters: FiltersVirtualPackageDto) {
		const where: Prisma.MaloteVirtualWhereInput = {
			empresa_id: user.empresa_id,
			situacao: filters.situacao?.length
				? { in: filters.situacao }
				: undefined,
			excluido: false,
			id: filters.malotes_virtuais_ids?.length
				? { in: filters.malotes_virtuais_ids }
				: filters.codigo,
			created_at:
				filters.tipo_data == 1 && filters.data_filtro
					? {
							gte: setCustomHour(filters.data_filtro[0], 0, 0, 0),
							lte: setCustomHour(
								filters.data_filtro[1],
								23,
								59,
								59,
							),
					  }
					: undefined,
			data_saida:
				filters.tipo_data == 2 && filters.data_filtro
					? {
							gte: setCustomHour(filters.data_filtro[0], 0, 0, 0),
							lte: setCustomHour(
								filters.data_filtro[1],
								23,
								59,
								59,
							),
					  }
					: undefined,
			data_retorno:
				filters.tipo_data == 3 && filters.data_filtro
					? {
							gte: setCustomHour(filters.data_filtro[0], 0, 0, 0),
							lte: setCustomHour(
								filters.data_filtro[1],
								23,
								59,
								59,
							),
					  }
					: undefined,
			malote_fisico: filters.codigo_malote_fisico
				? {
						codigo: {
							contains: filters.codigo_malote_fisico,
							mode: 'insensitive',
						},
				  }
				: undefined,
			condominio_id: filters.condominios_ids
				? { in: filters.condominios_ids }
				: undefined,
			usuario_id: filters.usuario_ids
				? { in: filters.usuario_ids }
				: undefined,
		};

		let data;
		if (filters.tipo === VirtualPackageType.SINTETICO) {
			data = await this.reportSynthetic(where);
		} else {
			data = await this.reportAnalytic(where);

			Promise.all(
				data.map(async (virtualPackage) => {
					await this.prisma.protocoloDocumentoHistorico.createMany({
						data: virtualPackage.documentos_malote.map(
							(document) => ({
								documento_id: document.documento.id,
								usuario_id: user.id,
								situacao:
									ProtocolHistorySituation.MALOTE_IMPRESSO,
							}),
						),
					});
				}),
			);
		}

		return data;
	}

	reportAnalytic(where: Prisma.MaloteVirtualWhereInput) {
		return this.prisma.maloteVirtual.findMany({
			select: {
				data_saida: true,
				data_retorno: true,
				malote_fisico: {
					select: {
						codigo: true,
					},
				},
				condominio: {
					select: {
						id: true,
						nome: true,
						departamentos_condominio: {
							select: {
								departamento: {
									select: {
										id: true,
										nome: true,
									},
								},
							},
						},
					},
				},
				documentos_malote: {
					select: {
						justificativa: true,
						documento: {
							select: {
								id: true,
								discriminacao: true,
								retorna: true,
							},
						},
					},
				},
			},
			where,
		});
	}

	reportSynthetic(where: Prisma.MaloteVirtualWhereInput) {
		return this.prisma.maloteVirtual.findMany({
			select: {
				data_saida: true,
				protocolado_baixado: true,
				malote_fisico: {
					select: {
						codigo: true,
					},
				},
				condominio: {
					select: {
						id: true,
						nome: true,
					},
				},
				updated_at: true,
			},
			where,
		});
	}

	async findSetupData(empresa_id: number) {
		const data = await this.prisma.sistemaSetup.findFirst({
			select: {
				obriga_malote_fisico: true,
			},
			where: {
				empresa_id,
			},
		});

		return data;
	}

	async findAllPending(
		empresa_id: number,
		filter: FiltersSearchVirtualPackageDto,
		pagination?: Pagination,
	) {
		const where: Prisma.MaloteVirtualWhereInput = {
			empresa_id,
			situacao: filter.situacao?.length
				? { in: filter.situacao }
				: undefined,
			excluido: false,
			id: filter.codigo,
			created_at:
				filter.tipo_data == 1 && filter.data_filtro
					? {
							gte: setCustomHour(filter.data_filtro[0], 0, 0, 0),
							lte: setCustomHour(
								filter.data_filtro[1],
								23,
								59,
								59,
							),
					  }
					: undefined,
			data_saida:
				filter.tipo_data == 2 && filter.data_filtro
					? {
							gte: setCustomHour(filter.data_filtro[0], 0, 0, 0),
							lte: setCustomHour(
								filter.data_filtro[1],
								23,
								59,
								59,
							),
					  }
					: undefined,
			data_retorno:
				filter.tipo_data == 3 && filter.data_filtro
					? {
							gte: setCustomHour(filter.data_filtro[0], 0, 0, 0),
							lte: setCustomHour(
								filter.data_filtro[1],
								23,
								59,
								59,
							),
					  }
					: undefined,
			malote_fisico: filter.codigo_malote_fisico
				? {
						codigo: {
							contains: filter.codigo_malote_fisico,
							mode: 'insensitive',
						},
				  }
				: undefined,
			condominio_id: filter.condominios_ids
				? { in: filter.condominios_ids }
				: undefined,

			condominio: filter.departmento_destino_id
				? {
						departamentos_condominio: {
							some: {
								departamento_id: filter.departmento_destino_id,
							},
						},
				  }
				: undefined,
			usuario_id: filter.usuario_ids
				? { in: filter.usuario_ids }
				: undefined,
			OR: filter.lacre
				? [
						{
							lacre_saida: {
								contains: filter.lacre,
								mode: 'insensitive',
							},
						},
						{
							lacre_retorno: {
								contains: filter.lacre,
								mode: 'insensitive',
							},
						},
				  ]
				: undefined,
		};

		const malotes = await this.prisma.maloteVirtual.findMany({
			select: {
				id: true,
				situacao: true,
				data_saida: true,
				protocolado_baixado: true,
				condominio: {
					select: {
						nome: true,
						departamentos_condominio: {
							select: {
								departamento: {
									select: {
										id: true,
										nome: true,
									},
								},
							},
						},
						setup_rotas: {
							select: {
								motoqueiro: {
									select: { id: true, nome: true },
								},
							},
						},
					},
				},
				malote_fisico: { select: { codigo: true } },
				lacre_saida: true,
				lacre_retorno: true,
				usuario: { select: { nome: true } },
			},
			where,
			take: pagination?.page ? 20 : 100,
			skip: pagination?.page ? (pagination?.page - 1) * 20 : undefined,
		});

		const total_pages = await this.prisma.maloteVirtual.count({
			where,
		});

		return {
			success: true,
			data: malotes,
			total_pages,
		};
	}

	async changeSituationPackageDoc(
		receivePackageVirtualPackageDto: ReceivePackageVirtualPackageDto,
		empresa_id: number,
		situacaoCheck: number,
		situacaoAtual: number,
	) {
		const virtualPackages = await this.prisma.maloteVirtual.findMany({
			where: {
				id: {
					in: receivePackageVirtualPackageDto.malotes_virtuais_ids,
				},
				situacao: situacaoCheck,
				excluido: false,
				empresa_id,
			},
		});

		if (!virtualPackages.length)
			throw new BadRequestException(
				'A situação do(s) malote(s) não pode ser alterada!',
			);

		await Promise.all(
			virtualPackages.map(
				async (pack) =>
					await this.prisma.maloteVirtual.update({
						data: {
							situacao: situacaoAtual,
							situacao_anterior: pack.situacao,
							data_retorno:
								situacaoAtual ==
								VirtualPackageSituation.RETORNADO
									? new Date()
									: undefined,
							data_saida:
								situacaoAtual == VirtualPackageSituation.ENVIADO
									? new Date()
									: undefined,
						},
						where: { id: pack.id },
					}),
			),
		);
	}

	async receiveDoc(
		id: number,
		receiveVirtualPackageDto: ReceiveVirtualPackageDto,
		user: UserAuth,
	) {
		if (Number.isNaN(id)) {
			throw new BadRequestException('Documento não encontrado');
		}

		const maloteReceived = await this.prisma.maloteVirtual.findUnique({
			where: { id },
		});

		if (maloteReceived.situacao != 2) {
			throw new BadRequestException(
				'Somente malotes retornados podem ser baixados',
			);
		}

		const documents = await this.prisma.maloteDocumento.findMany({
			select: {
				id: true,
				malote_virtual_id: true,
			},
			where: {
				id: {
					in: receiveVirtualPackageDto.documentos_ids,
				},
				malote_virtual_id: id,
				excluido: false,
				situacao: VirtualPackageDocumentSituation.PENDENTE,
				malote_virtual: {
					excluido: false,
					empresa_id: user.empresa_id,
					OR: [
						{
							situacao: VirtualPackageSituation.RETORNADO,
						},
						{
							situacao: VirtualPackageSituation.PROTOCOLADO,
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
											excluido: false,
										},
										{
											excluido: true,
										},
									],
								},
							},
							documentos_protocolo: {
								every: {
									OR: [
										{
											aceito: true,
											excluido: false,
											protocolo: {
												excluido: false,
												situacao: {
													notIn: [
														ProtocolSituation.CANCELADO,
													],
												},
												destino_departamento_id:
													!user.acessa_todos_departamentos
														? {
																in: user.departamentos_ids,
														  }
														: undefined,
											},
										},
										{ excluido: true },
									],
								},
							},
						},
					],
				},
			},
		});

		if (!documents.length)
			throw new BadRequestException(
				'Documento(s) informado(s) já baixado(s) ou não encontrado(s)',
			);

		const documents_ids_accept = documents.map((document) => document.id);

		await this.prisma.maloteDocumento.updateMany({
			data: {
				situacao: receiveVirtualPackageDto.recebido
					? VirtualPackageDocumentSituation.BAIXADO
					: VirtualPackageDocumentSituation.NAO_RECEBIDO,
				justificativa:
					receiveVirtualPackageDto?.justificativa || undefined,
			},
			where: {
				malote_virtual_id: id,
				id: {
					in: documents_ids_accept,
				},
			},
		});

		await this.prisma.protocoloDocumentoHistorico.createMany({
			data: documents_ids_accept.map((document_id) => ({
				documento_id: document_id,
				usuario_id: user.id,
				situacao: receiveVirtualPackageDto.recebido
					? ProtocolHistorySituation.BAIXADO
					: ProtocolHistorySituation.NAO_RETORNADO,
				descricao: receiveVirtualPackageDto?.justificativa,
			})),
		});

		const malote = await this.prisma.maloteVirtual.findFirst({
			select: {
				malote_fisico_id: true,
				situacao: true,
				documentos_malote: {
					select: {
						id: true,
					},
					where: {
						excluido: false,
						situacao: VirtualPackageDocumentSituation.PENDENTE,
					},
				},
			},
			where: { id },
		});

		if (!malote.documentos_malote.length) {
			await this.prisma.maloteVirtual.update({
				data: {
					protocolado_baixado:
						malote.situacao == VirtualPackageSituation.PROTOCOLADO
							? true
							: undefined,
					situacao:
						malote.situacao == VirtualPackageSituation.PROTOCOLADO
							? undefined
							: VirtualPackageSituation.BAIXADO,
					situacao_anterior:
						malote.situacao == VirtualPackageSituation.PROTOCOLADO
							? undefined
							: malote.situacao,
				},
				where: {
					id,
				},
			});

			if (!malote.situacao && malote.malote_fisico_id) {
				const malote_fisico =
					await this.prisma.malotesFisicos.findFirst({
						select: {
							id: true,
						},
						where: {
							id: malote.malote_fisico_id,
							disponivel: false,
							malotes_virtuais: {
								every: {
									documentos_malote: {
										every: {
											situacao:
												VirtualPackageDocumentSituation.PENDENTE,
										},
									},
								},
							},
						},
					});

				if (!malote_fisico) {
					throw new BadRequestException('Malote não encontrado');
				}

				await this.prisma.malotesFisicos.update({
					data: { disponivel: true },
					where: {
						id: malote.malote_fisico_id,
					},
				});
			}
		}

		return;
	}

	async reverseReceiveDoc(
		id: number,
		reverseReceiveVirtualPackageDto: ReverseReceiveVirtualPackageDto,
		user: UserAuth,
	) {
		if (Number.isNaN(id))
			throw new BadRequestException('Documento não encontrado');

		const virtualPackage = await this.prisma.maloteVirtual.findFirst({
			select: {
				situacao: true,
				situacao_anterior: true,
				protocolado_baixado: true,
			},
			where: {
				id,
			},
		});

		const documents = await this.prisma.maloteDocumento.findMany({
			select: {
				id: true,
				malote_virtual_id: true,
				situacao: true,
			},
			where: {
				id: { in: reverseReceiveVirtualPackageDto.documentos_ids },
				malote_virtual_id: id,
				excluido: false,
				situacao: {
					in: [
						VirtualPackageDocumentSituation.BAIXADO,
						VirtualPackageDocumentSituation.NAO_RECEBIDO,
					],
				},
				malote_virtual: {
					excluido: false,
					empresa_id: user.empresa_id,
				},
			},
		});

		if (
			!documents.length ||
			(virtualPackage.situacao == VirtualPackageSituation.BAIXADO &&
				virtualPackage.protocolado_baixado)
		)
			throw new BadRequestException(
				'Documento(s) informado(s) não pode ser estornado(s) ou não encontrado(s)',
			);

		const documents_ids_accept = documents.map((document) => ({
			id: document.id,
			situacao: document.situacao,
		}));

		await this.prisma.maloteDocumento.updateMany({
			data: {
				situacao: VirtualPackageDocumentSituation.PENDENTE,
				justificativa: null,
			},
			where: {
				malote_virtual_id: id,
				id: { in: documents_ids_accept.map((d) => d.id) },
			},
		});

		await this.prisma.maloteVirtual.update({
			data: {
				situacao: virtualPackage.protocolado_baixado
					? VirtualPackageSituation.PROTOCOLADO
					: virtualPackage.situacao_anterior || undefined,
				situacao_anterior: virtualPackage.protocolado_baixado
					? undefined
					: null,
				protocolado_baixado: false,
			},
			where: {
				id,
			},
		});

		await this.prisma.protocoloDocumentoHistorico.createMany({
			data: documents_ids_accept.map((document) => ({
				documento_id: document.id,
				usuario_id: user.id,
				situacao:
					document.situacao == 3
						? ProtocolHistorySituation.ESTORNO_NAO_RETORNADO
						: ProtocolHistorySituation.ESTORNO_BAIXA,
			})),
		});

		return;
	}

	async createNewDoc(
		id: number,
		receiveNewDocumentVirtualPackageDto: CreateNewDocumenteProtocolVirtualPackageDto,
		user: UserAuth,
	) {
		if (Number.isNaN(id)) {
			throw new BadRequestException('Malote não encontrado');
		}

		const malote = await this.prisma.maloteVirtual.findUnique({
			select: {
				condominio_id: true,
			},
			where: { id: id },
		});

		if (!malote) throw new BadRequestException('Malote não encontrado');

		const newDocuments = await this.prisma.maloteDocumento.findFirst({
			include: {
				documento: true,
			},
			where: {
				malote_virtual_id: id,
				excluido: false,
				documento: { fila_geracao_malote: { none: {} } },
			},
		});

		let protocol: Prisma.ProtocoloWhereUniqueInput;
		if (newDocuments) {
			protocol = await this.prisma.protocolo.findFirst({
				select: { id: true },
				where: {
					id: newDocuments.documento.protocolo_id,
					excluido: false,
					situacao: { notIn: [ProtocolSituation.CANCELADO] },
				},
			});
		}

		if (!protocol)
			protocol = await this.prisma.protocolo.create({
				data: {
					empresa_id: user.empresa_id,
					tipo: 1,
					finalizado: true,
					situacao: ProtocolSituation.ACEITO,
					destino_departamento_id:
						receiveNewDocumentVirtualPackageDto.departamento_id,
					origem_usuario_id: user.id,
					origem_departamento_id:
						receiveNewDocumentVirtualPackageDto.departamento_id,
					data_finalizado: new Date(),
					ativo: true,
				},
			});

		const data = receiveNewDocumentVirtualPackageDto.documentos.map(
			(doc) => ({
				protocolo_id: protocol.id,
				aceito: true,
				discriminacao: doc.discriminacao,
				observacao: doc.observacao || null,
				retorna: false,
				pessoa_id: malote.condominio_id,
				tipo_documento_id: doc.tipo_documento_id,
				aceite_usuario_id: user.id,
				data_aceite: new Date(),
			}),
		);

		const docs = await Promise.all(
			data.map((item) =>
				this.prisma.protocoloDocumento.create({ data: item }),
			),
		);

		await this.prisma.maloteDocumento.createMany({
			data: docs.map((doc) => ({
				documento_id: doc.id,
				malote_virtual_id: id,
				situacao: VirtualPackageDocumentSituation.BAIXADO,
			})),
		});

		return docs;
	}

	async findAllNewDocs(id: number, empresa_id: number) {
		if (Number.isNaN(id))
			throw new BadRequestException('Malote não encontrado');

		const malote = await this.prisma.maloteVirtual.findUnique({
			select: {
				condominio_id: true,
			},
			where: { id: id },
		});

		if (!malote) throw new BadRequestException('Malote não encontrado');

		const protocolo = await this.prisma.protocolo.findFirst({
			where: {
				empresa_id: empresa_id,
				finalizado: false,
				excluido: false,
				situacao: { notIn: [ProtocolSituation.CANCELADO] },
				ativo: true,
			},
		});

		if (!protocolo) return [];

		return this.prisma.protocoloDocumento.findMany({
			select: {
				id: true,
				discriminacao: true,
				observacao: true,
				tipo_documento: {
					select: {
						id: true,
						nome: true,
					},
				},
			},
			where: {
				protocolo_id: protocolo.id,
				excluido: false,
			},
		});
	}

	async removeNewDoc(id: number, id_document: number, user: UserAuth) {
		if (Number.isNaN(id))
			throw new BadRequestException('Malote não encontrado');

		const malote = await this.prisma.maloteVirtual.findFirst({
			select: {
				condominio_id: true,
			},
			where: { id: id, empresa_id: user.empresa_id },
		});

		if (!malote) throw new BadRequestException('Malote não encontrado');

		const documentoMalote = await this.prisma.maloteDocumento.findFirst({
			where: { documento_id: id_document, malote_virtual_id: id },
		});

		if (!documentoMalote)
			throw new BadRequestException('Documento não encontrado');

		await this.prisma.maloteDocumento.update({
			data: { excluido: true },
			where: { id: documentoMalote.id },
		});

		return this.prisma.protocoloDocumento.update({
			data: {
				excluido: true,
			},
			where: {
				id: id_document,
			},
		});
	}

	async finalizeNewDocs(id: number, user: UserAuth) {
		if (Number.isNaN(id))
			throw new BadRequestException('Malote não encontrado');

		const malote = await this.prisma.maloteVirtual.findUnique({
			select: {
				condominio_id: true,
			},
			where: { id: id },
		});

		if (!malote) throw new BadRequestException('Malote não encontrado');

		const protocolo = await this.prisma.protocolo.findFirst({
			where: {
				finalizado: false,
				excluido: false,
				ativo: true,
				situacao: { notIn: [ProtocolSituation.CANCELADO] },
			},
		});

		if (!protocolo)
			throw new BadRequestException('Protocolo não encontrado');

		return this.prisma.protocolo.update({
			data: {
				finalizado: true,
				origem_usuario_id: user.id,
			},
			where: {
				id: protocolo.id,
			},
		});
	}

	async reverseDoc(
		id: number,
		reverseVirtualPackageDto: ReverseVirtualPackageDto,
		user: UserAuth,
	) {
		if (Number.isNaN(id)) {
			throw new BadRequestException('Documento não encontrado');
		}

		const documents = await this.prisma.maloteDocumento.findMany({
			select: {
				id: true,
				documento: true,
			},
			where: {
				id: { in: reverseVirtualPackageDto.documentos_ids },
				malote_virtual_id: id,
				excluido: false,
				situacao: VirtualPackageDocumentSituation.PENDENTE,
				malote_virtual: {
					excluido: false,
					empresa_id: user.empresa_id,
					situacao: VirtualPackageSituation.PENDENTE,
				},
			},
		});

		if (!documents.length)
			throw new BadRequestException(
				'Documentos baixados não podem ser excluídos',
			);

		const documents_ids_package = documents.map((document) => document.id);

		const documents_ids_accept = documents.map(
			(document) => document.documento.id,
		);

		await this.prisma.maloteDocumento.updateMany({
			data: { excluido: true },
			where: {
				id: { in: documents_ids_package },
			},
		});

		await this.prisma.documentoFilaGeracao.updateMany({
			data: {
				gerado: false,
			},
			where: {
				documento_id: { in: documents_ids_accept },
				excluido: false,
			},
		});

		await this.prisma.protocoloDocumentoHistorico.createMany({
			data: documents_ids_accept.map((document_id) => ({
				documento_id: document_id,
				usuario_id: user.id,
				situacao: ProtocolHistorySituation.ESTORNO_MALOTE,
			})),
		});

		const malote = await this.prisma.maloteVirtual.findUnique({
			select: {
				documentos_malote: {
					select: {
						id: true,
					},
					where: { excluido: false },
				},
			},
			where: { id: id },
		});

		if (!malote.documentos_malote.length) {
			await this.prisma.maloteVirtual.update({
				data: {
					excluido: true,
				},
				where: { id },
			});
		}

		return;
	}

	async findDocs(empresa_id: number, id: number, pagination: Pagination) {
		if (Number.isNaN(id) || Number.isNaN(empresa_id)) {
			throw new BadRequestException('Malote não encontrado');
		}

		const virtualPackageExists = await this.prisma.maloteVirtual.findFirst({
			where: {
				empresa_id,
				id,
				excluido: false,
			},
		});

		if (!virtualPackageExists) {
			throw new BadRequestException('Malote não encontrado');
		}

		const total_pages = await this.prisma.maloteDocumento.count({
			where: {
				malote_virtual_id: id,
				excluido: false,
			},
		});

		const gerados = await this.prisma.maloteDocumento.findMany({
			include: {
				documento: { include: { tipo_documento: true } },
			},
			where: {
				malote_virtual_id: id,
				excluido: false,
				documento: { fila_geracao_malote: { some: {} } },
			},
			orderBy: [
				{
					documento: {
						retorna: 'desc',
					},
				},
				{
					situacao: 'asc',
				},
			],
			take: pagination?.page ? 10 : 100,
			skip: pagination?.page ? (pagination?.page - 1) * 1 : undefined,
		});

		const novos = await this.prisma.maloteDocumento.findMany({
			include: {
				documento: { include: { tipo_documento: true } },
			},
			where: {
				malote_virtual_id: id,
				excluido: false,
				documento: { fila_geracao_malote: { none: {} } },
			},
		});

		return {
			data: { gerados, novos },
			total_pages,
		};
	}

	async createPackageProtocol(
		createProtocolVirtualPackageDto: CreateProtocolVirtualPackageDto,
		user: UserAuth,
	) {
		const virtualPackages = await this.prisma.maloteVirtual.findMany({
			include: {
				malote_fisico: true,
			},
			where: {
				id: {
					in: createProtocolVirtualPackageDto.malotes_virtuais_ids,
				},
				condominio: {
					departamentos_condominio: {
						some: {
							departamento_id:
								createProtocolVirtualPackageDto.destino_departamento_id,
						},
					},
				},
				OR: [
					{
						situacao: {
							in: [
								VirtualPackageSituation.BAIXADO,
								VirtualPackageSituation.RETORNADO,
							],
						},
						documentos_malote: {
							every: {
								OR: [
									{
										situacao:
											VirtualPackageDocumentSituation.PENDENTE,
									},
									{ excluido: true },
								],
							},
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

		if (!virtualPackages.length)
			throw new BadRequestException(
				'Malote(s) informado(s) não pode(m) ser utilizado(s)',
			);

		const protocolo = await this.prisma.protocolo.create({
			data: {
				tipo: createProtocolVirtualPackageDto.tipo,
				destino_departamento_id:
					createProtocolVirtualPackageDto.destino_departamento_id,
				destino_usuario_id:
					createProtocolVirtualPackageDto.destino_usuario_id,
				origem_usuario_id: user.id,
				origem_departamento_id:
					createProtocolVirtualPackageDto.origem_departamento_id,
				protocolo_malote: true,
				ativo: true,
				empresa_id: user.empresa_id,
				finalizado: true,
			},
		});

		if (!protocolo)
			throw new BadRequestException(
				'Ocorreu um erro ao protocolar o(s) malotes(s)',
			);

		await Promise.all(
			virtualPackages.map(async (virtualPackage) => {
				await this.prisma.protocoloDocumento.create({
					data: {
						protocolo_id: protocolo.id,
						discriminacao: `Malote Virtual: ${
							virtualPackage.id
						}; Malote Físico: ${
							virtualPackage.malote_fisico?.codigo || 'N/A'
						}`,
						observacao: '',
						retorna: false,
						pessoa_id: virtualPackage.condominio_id,
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
			}),
		);
	}

	async makePhysicalPackageAvailable(empresa_id: number, id: number) {
		if (Number.isNaN(id) || Number.isNaN(empresa_id)) {
			throw new BadRequestException('Malote não encontrado');
		}

		const virtualPackageExists = await this.prisma.maloteVirtual.findFirst({
			where: {
				empresa_id,
				id,
				malote_disponibilizado: false,
				excluido: false,
				malote_fisico: {
					disponivel: false,
				},
			},
		});

		if (!virtualPackageExists) {
			throw new BadRequestException(
				'Malote não encontrado ou malote já foi liberado',
			);
		}

		return this.prisma.maloteVirtual.update({
			data: {
				malote_disponibilizado: true,
				malote_fisico: {
					update: {
						disponivel: true,
						ativo: true,
						excluido: false,
					},
				},
			},
			where: {
				id,
			},
		});
	}
}
