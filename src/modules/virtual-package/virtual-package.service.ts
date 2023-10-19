import { setCustomHour } from 'src/shared/helpers/date.helper';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreateVirtualPackageDto } from './dto/create-virtual-package.dto';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { CreateNewDocumentVirtualPackageDto } from './dto/create-new-document-virtual-package.dto';
import { UpdateNewDocumentVirtualPackageDto } from './dto/update-new-document-virtual-package.dto';
import { ReceiveVirtualPackageDto } from './dto/receive-virtual-package.dto';
import { ReverseReceiveVirtualPackageDto } from './dto/reverse-receive-virtual-package.dto';
import { FiltersVirtualPackageDto } from './dto/filters-virtual-package.dto';
import { VirtualPackageType } from 'src/shared/consts/report-virtual-package-tyoe.const';
import { Prisma } from '@prisma/client';
import { ReverseVirtualPackageDto } from './dto/reverse-virtual-package.dto';
import { FiltersSearchVirtualPackageDto } from './dto/filters-search-virtual-package.dto';
import { Pagination } from 'src/shared/entities/pagination.entity';

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
				finalizado: true,
				data_saida: true,
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
						finalizado: true,
						excluido: true,
						documento: {
							select: {
								id: true,
								tipo_documento: {
									select: {
										id: true,
										nome: true,
									},
								},
								discriminacao: true,
								observacao: true,
								vencimento: true,
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
			condominio: {
				select: {
					id: true,
					nome: true,
				},
			},
			documentos_malote: {
				select: {
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
			finalizado: filter.finalizado,
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
			finalizado: filter.finalizado,
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
			usuario_id: filter.usuario_ids
				? { in: filter.usuario_ids }
				: undefined,
		};
		const malotes = await this.prisma.maloteVirtual.findMany({
			select: {
				id: true,
				finalizado: true,
				data_saida: true,
				condominio: {
					select: {
						nome: true,
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

	async receiveDoc(
		id: number,
		receiveVirtualPackageDto: ReceiveVirtualPackageDto,
		empresa_id: number,
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
				finalizado: false,
				malote_virtual: {
					excluido: false,
					empresa_id,
					finalizado: false,
				},
			},
		});

		if (!documents.length)
			throw new BadRequestException(
				'Documento(s) informado(s) já baixado(s) ou não encontrado(s)',
			);

		const documents_ids_accept = documents.map((document) => document.id);

		await this.prisma.maloteDocumento.updateMany({
			data: { finalizado: true },
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
				finalizado: true,
				documentos_malote: {
					select: {
						id: true,
					},
					where: {
						excluido: false,
						finalizado: false,
					},
				},
			},
			where: { id },
		});

		if (!malote.documentos_malote.length) {
			await this.prisma.maloteVirtual.update({
				data: {
					finalizado: true,
				},
				where: {
					id,
				},
			});

			if (!malote.finalizado && malote.malote_fisico_id) {
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
											finalizado: false,
										},
									},
								},
							},
						},
					});

				console.log(malote_fisico);
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

		const documents = await this.prisma.maloteDocumento.findMany({
			select: {
				id: true,
				malote_virtual_id: true,
				malote_virtual: {
					select: {
						finalizado: true,
					},
				},
			},
			where: {
				id: { in: reverseReceiveVirtualPackageDto.documentos_ids },
				malote_virtual_id: id,
				excluido: false,
				finalizado: true,
				malote_virtual: {
					excluido: false,
					empresa_id,
				},
			},
		});

		if (!documents.length)
			throw new BadRequestException(
				'Documento(s) informado(s) não pode ser estornado(s) ou não encontrado(s)',
			);

		const documents_ids_accept = documents.map((document) => document.id);

		await this.prisma.maloteDocumento.updateMany({
			data: { finalizado: false },
			where: {
				malote_virtual_id: id,
				id: { in: documents_ids_accept },
			},
		});

		await this.prisma.maloteVirtual.update({
			data: { finalizado: false },
			where: {
				id,
			},
		});

		return;
	}

	async createNewDoc(
		id: number,
		receiveNewDocumentVirtualPackageDto: CreateNewDocumentVirtualPackageDto,
		user: UserAuth,
	) {
		if (Number.isNaN(id))
			throw new BadRequestException('Malote não encontrado');

		const malote = await this.prisma.maloteVirtual.findUnique({
			select: {
				condominio_id: true,
			},
			where: { id: id },
		});

		if (!malote) throw new BadRequestException('Malote não encontrado');

		let protocolo = await this.prisma.protocolo.findFirst({
			where: {
				malote_virtual_id: id,
				finalizado: false,
				excluido: false,
				ativo: true,
			},
		});

		if (!protocolo)
			protocolo = await this.prisma.protocolo.create({
				data: {
					empresa_id: user.empresa_id,
					tipo: 1,
					destino_departamento_id:
						receiveNewDocumentVirtualPackageDto.departamento_id,
					malote_virtual_id: id,
					origem_usuario_id: user.id,
					origem_departamento_id:
						receiveNewDocumentVirtualPackageDto.departamento_id,
					ativo: true,
				},
			});

		return this.prisma.protocoloDocumento.create({
			data: {
				protocolo_id: protocolo.id,
				discriminacao:
					receiveNewDocumentVirtualPackageDto.discriminacao,
				observacao:
					receiveNewDocumentVirtualPackageDto.observacao || null,
				retorna: false,
				condominio_id: malote.condominio_id,
				tipo_documento_id:
					receiveNewDocumentVirtualPackageDto.tipo_documento_id,
			},
		});
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
				malote_virtual_id: id,
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

	async updateNewDoc(
		id: number,
		id_document: number,
		updateNewDocumentVirtualPackageDto: UpdateNewDocumentVirtualPackageDto,
		user: UserAuth,
	) {
		if (Number.isNaN(id))
			throw new BadRequestException('Malote não encontrado');

		const malote = await this.prisma.maloteVirtual.findFirst({
			select: {
				condominio_id: true,
			},
			where: { id: id, empresa_id: user.empresa_id },
		});

		if (!malote) throw new BadRequestException('Malote não encontrado');

		const protocolo = await this.prisma.protocolo.findFirst({
			where: {
				malote_virtual_id: id,
				finalizado: false,
				excluido: false,
				ativo: true,
			},
		});

		if (!protocolo)
			throw new BadRequestException('Protocolo não encontrado');

		if (updateNewDocumentVirtualPackageDto.departamento_id)
			await this.prisma.protocolo.update({
				data: {
					destino_departamento_id:
						updateNewDocumentVirtualPackageDto.departamento_id,
					origem_usuario_id: user.id,
				},
				where: {
					id,
				},
			});

		return this.prisma.protocoloDocumento.update({
			data: {
				discriminacao:
					updateNewDocumentVirtualPackageDto.discriminacao ||
					undefined,
				observacao:
					updateNewDocumentVirtualPackageDto.observacao || null,
				tipo_documento_id:
					updateNewDocumentVirtualPackageDto.tipo_documento_id ||
					undefined,
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
				malote_virtual_id: id,
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
			},
			where: {
				id: { in: reverseVirtualPackageDto.documentos_ids },
				malote_virtual_id: id,
				excluido: false,
				finalizado: false,
				malote_virtual: {
					excluido: false,
					empresa_id,
					finalizado: false,
				},
			},
		});

		if (!documents.length)
			throw new BadRequestException(
				'Documento(s) informado(s) não gerado(s) ou não encontrado(s)',
			);

		const documents_ids_accept = documents.map((document) => document.id);

		await this.prisma.maloteDocumento.updateMany({
			data: { excluido: true },
			where: {
				id: { in: documents_ids_accept },
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
}
