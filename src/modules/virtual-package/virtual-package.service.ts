import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { VirtualPackageType } from 'src/shared/consts/report-virtual-package-tyoe.const';
import { Pagination } from 'src/shared/entities/pagination.entity';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { setCustomHour } from 'src/shared/helpers/date.helper';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreateProtocolVirtualPackageDto } from './dto/create-new-protocol-virtual-package.dto';
import { CreateVirtualPackageDto } from './dto/create-virtual-package.dto';
import { FiltersSearchVirtualPackageDto } from './dto/filters-search-virtual-package.dto';
import { FiltersVirtualPackageDto } from './dto/filters-virtual-package.dto';
import { ReceivePackageVirtualPackageDto } from './dto/receive-package-virtual-package.dto';
import { ReceiveVirtualPackageDto } from './dto/receive-virtual-package.dto';
import { ReverseReceiveVirtualPackageDto } from './dto/reverse-receive-virtual-package.dto';
import { ReverseVirtualPackageDto } from './dto/reverse-virtual-package.dto';
import { CreateNewDocumenteProtocolVirtualPackageDto } from './dto/create-new-document-protocol-virtual-package.dto';

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

		const documentos = await this.prisma.protocoloDocumento.findMany({
			select: {
				id: true,
			},
			where: {
				condominio_id: createVirtualPackageDto.condominio_id,
				condominio: {
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
				condominio_id: 'asc',
			},
		});

		if (!documentos.length)
			throw new BadRequestException('Documentos não encontrados');

		const malote = await this.prisma.maloteVirtual.create({
			data: {
				usuario_id: user.id,
				empresa_id: user.empresa_id,
				condominio_id: createVirtualPackageDto.condominio_id,
				malote_fisico_id: createVirtualPackageDto.malote_fisico_id,
				data_saida: new Date(),
				documentos_malote: {
					createMany: {
						data: documentos.map((document) => ({
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
				documento_id: { in: documentos.map((document) => document.id) },
				gerado: false,
				empresa_id: user.empresa_id,
			},
		});

		if (malote?.malote_fisico_id) {
			await this.prisma.malotesFisicos.update({
				data: { disponivel: false },
				where: { id: malote.malote_fisico_id },
			});
		}

		return { success: true, message: 'Malote gerado com successo!' };
	}

	findById(empresa_id: number, id: number) {
		if (Number.isNaN(id))
			throw new BadRequestException('Malote não encontrado');

		return this.prisma.maloteVirtual.findFirst({
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

	findBy(empresa_id: number, filter: FiltersVirtualPackageDto) {
		const documentsSelect: Prisma.MaloteVirtualSelect = {
			data_saida: true,
			data_retorno: true,
			malote_fisico: {
				select: {
					codigo: true,
				},
			},
			id: true,
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
		};

		const packagesSelect: Prisma.MaloteVirtualSelect = {
			data_saida: true,
			data_retorno: true,
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
		};

		const where: Prisma.MaloteVirtualWhereInput = {
			empresa_id,
			situacao: filter.situacao,
			excluido: false,
			id: filter.malotes_virtuais_ids?.length
				? { in: filter.malotes_virtuais_ids }
				: filter.codigo,
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
			usuario_id: filter.usuario_ids
				? { in: filter.usuario_ids }
				: undefined,
		};

		return this.prisma.maloteVirtual.findMany({
			select:
				filter.tipo === VirtualPackageType.SINTETICO
					? packagesSelect
					: documentsSelect,
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
			situacao: filter.situacao,
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
								motoqueiro: true,
							},
						},
					},
				},
				malote_fisico: { select: { codigo: true } },
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

	async receivePackageDoc(
		receivePackageVirtualPackageDto: ReceivePackageVirtualPackageDto,
		empresa_id: number,
	) {
		const virtualPackages = await this.prisma.maloteVirtual.findMany({
			where: {
				id: {
					in: receivePackageVirtualPackageDto.malotes_virtuais_ids,
				},
				situacao: 1,
				excluido: false,
				empresa_id,
			},
		});

		if (!virtualPackages.length)
			throw new BadRequestException(
				'Malote(s) informado(s) já retornado(s) ou não encontrado(s)',
			);

		await Promise.all(
			virtualPackages.map(
				async (pack) =>
					await this.prisma.maloteVirtual.update({
						data: {
							situacao: 2,
							situacao_anterior: pack.situacao,
							data_retorno: new Date(),
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
				situacao: 1,
				malote_virtual: {
					excluido: false,
					empresa_id: user.empresa_id,
					OR: [
						{
							situacao: { in: [1, 2] },
						},
						{
							situacao: 3,
							documentos_malote: {
								every: {
									OR: [
										{
											situacao: { in: [2, 3] },
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
											protocolo:
												!user.acessa_todos_departamentos
													? {
															destino_departamento_id:
																{
																	in: user.departamentos_ids,
																},
													  }
													: undefined,
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
				situacao: receiveVirtualPackageDto.recebido ? 2 : 3,
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
						situacao: 1,
					},
				},
			},
			where: { id },
		});

		if (!malote.documentos_malote.length) {
			await this.prisma.maloteVirtual.update({
				data: {
					protocolado_baixado:
						malote.situacao == 3 ? true : undefined,
					situacao: malote.situacao == 3 ? undefined : 4,
					situacao_anterior:
						malote.situacao == 3 ? undefined : malote.situacao,
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
											situacao: 1,
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

		return {
			success: true,
			message: 'Documento(s) baixado(s) com sucesso!',
		};
	}

	async reverseReceiveDoc(
		id: number,
		reverseReceiveVirtualPackageDto: ReverseReceiveVirtualPackageDto,
		empresa_id: number,
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
			},
			where: {
				id: { in: reverseReceiveVirtualPackageDto.documentos_ids },
				malote_virtual_id: id,
				excluido: false,
				situacao: { in: [2, 3] },
				malote_virtual: {
					excluido: false,
					empresa_id,
				},
			},
		});

		if (
			!documents.length ||
			(virtualPackage.situacao == 4 && virtualPackage.protocolado_baixado)
		)
			throw new BadRequestException(
				'Documento(s) informado(s) não pode ser estornado(s) ou não encontrado(s)',
			);

		const documents_ids_accept = documents.map((document) => document.id);

		await this.prisma.maloteDocumento.updateMany({
			data: { situacao: 1, justificativa: null },
			where: {
				malote_virtual_id: id,
				id: { in: documents_ids_accept },
			},
		});

		await this.prisma.maloteVirtual.update({
			data: {
				situacao: virtualPackage.protocolado_baixado
					? 3
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

		const novos = await this.prisma.maloteDocumento.findFirst({
			include: {
				documento: true,
			},
			where: {
				malote_virtual_id: id,
				excluido: false,
				documento: { fila_geracao_malote: { none: {} } },
			},
		});

		let protocolo: Prisma.ProtocoloWhereUniqueInput;
		if (novos) {
			protocolo = await this.prisma.protocolo.findFirst({
				select: { id: true },
				where: {
					id: novos.documento.protocolo_id,
				},
			});
		}

		if (!protocolo)
			protocolo = await this.prisma.protocolo.create({
				data: {
					empresa_id: user.empresa_id,
					tipo: 1,
					finalizado: true,
					situacao: 3,
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
				protocolo_id: protocolo.id,
				aceito: true,
				discriminacao: doc.discriminacao,
				observacao: doc.observacao || null,
				retorna: false,
				condominio_id: malote.condominio_id,
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
				situacao: 2,
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
		empresa_id: number,
	) {
		if (Number.isNaN(id) || Number.isNaN(empresa_id)) {
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
				situacao: 1,
				malote_virtual: {
					excluido: false,
					empresa_id,
					situacao: 1,
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
						situacao: { in: [1, 2] },
						documentos_malote: {
							every: {
								OR: [{ situacao: 1 }, { excluido: true }],
							},
						},
					},
					{
						situacao: 4,
						documentos_malote: {
							every: {
								OR: [
									{ situacao: { in: [2, 3] } },
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
						condominio_id: virtualPackage.condominio_id,
						malote_virtual_id: virtualPackage.id,
					},
				});
				await this.prisma.maloteVirtual.update({
					data: {
						situacao_anterior:
							virtualPackage.situacao !== 4
								? virtualPackage.situacao
								: undefined,
						situacao: virtualPackage.situacao !== 4 ? 3 : undefined,
						protocolado_baixado: virtualPackage.situacao == 4,
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
