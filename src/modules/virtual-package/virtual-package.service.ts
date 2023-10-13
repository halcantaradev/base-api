import { setCustomHour } from 'src/shared/helpers/date.helper';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreateVirtualPackageDto } from './dto/create-virtual-package.dto';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { CreateNewDocumentVirtualPackageDto } from './dto/create-new-document-virtual-package.dto';
import { UpdateNewDocumentVirtualPackageDto } from './dto/update-new-document-virtual-package.dto';
import { ReceiveVirtualPackageDto } from './dto/receive-virtual-package.dto';
import { FiltersVirtualPackageDto } from './dto/filters-virtual-package.dto';
import { VirtualPackageType } from 'src/shared/consts/report-virtual-package-tyoe.const';
import { Prisma } from '@prisma/client';

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
						finalizado: true,
						estornado: true,
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

	findBy(empresa_id: number, filters: FiltersVirtualPackageDto) {
		const documentsSelect: Prisma.MaloteVirtualSelect = {
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
				where: {
					documento: {
						retorna: filters.documento_retorna
							? filters.documento_retorna
							: undefined,
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

		return this.prisma.maloteVirtual.findMany({
			select:
				filters.tipo === VirtualPackageType.SINTETICO
					? packagesSelect
					: documentsSelect,
			where: {
				condominio_id: filters.condominios_ids?.length
					? { in: filters.condominios_ids }
					: undefined,
				created_at: {
					gte: filters.data_emissao[0]
						? setCustomHour(filters.data_emissao[0], 0, 0, 0)
						: undefined,
					lte: filters.data_emissao[1]
						? setCustomHour(filters.data_emissao[1], 23, 59, 59)
						: undefined,
				},
				malote_fisico_id: filters.malote_fisico_ids?.length
					? { in: filters.malote_fisico_ids }
					: undefined,
				finalizado: filters.situacao ? filters.situacao : undefined,
				id: filters.codigo ? filters.codigo : undefined,
				updated_at: {
					gte: filters.data_retorno[0]
						? setCustomHour(filters.data_retorno[0], 0, 0, 0)
						: undefined,
					lte: filters.data_retorno[1]
						? setCustomHour(filters.data_retorno[1], 23, 59, 59)
						: undefined,
				},
				empresa_id,
			},
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

	findAllPending(empresa_id: number) {
		return this.prisma.maloteVirtual.findMany({
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
			},
			where: { empresa_id, finalizado: false, excluido: false },
		});
	}

	async receiveDoc(
		id: number,
		receiveVirtualPackageDto: ReceiveVirtualPackageDto,
		empresa_id: number,
	) {
		if (receiveVirtualPackageDto.documentos_ids.length)
			await Promise.all(
				receiveVirtualPackageDto.documentos_ids.map(
					async (id_document) => {
						if (Number.isNaN(id) || Number.isNaN(id_document))
							throw new BadRequestException(
								'Documento não encontrado',
							);

						const documento =
							await this.prisma.maloteDocumento.findFirst({
								select: {
									id: true,
									malote_virtual_id: true,
								},
								where: {
									documento_id: id_document,
									malote_virtual_id: id,
									estornado: false,
									finalizado: false,
									malote_virtual: {
										excluido: false,
										empresa_id,
										finalizado: false,
									},
								},
							});

						if (!documento)
							throw new BadRequestException(
								'Documento não encontrado',
							);

						await this.prisma.maloteDocumento.updateMany({
							data: { finalizado: true },
							where: {
								malote_virtual_id: id,
								documento_id: id_document,
							},
						});

						const malote =
							await this.prisma.maloteVirtual.findUnique({
								select: {
									malote_fisico_id: true,
									malote_baixado: true,
									documentos_malote: {
										select: {
											id: true,
										},
										where: {
											estornado: false,
											finalizado: false,
										},
									},
								},
								where: { id: id },
							});

						if (!malote.documentos_malote.length) {
							await this.prisma.maloteVirtual.update({
								data: {
									malote_baixado: true,
									finalizado: true,
								},
								where: {
									id,
								},
							});

							if (!malote.malote_baixado)
								await this.prisma.malotesFisicos.update({
									data: { disponivel: true },
									where: {
										id: malote.malote_fisico_id,
									},
								});
						}

						return;
					},
				),
			);
		else throw new BadRequestException('Documentos não informados');

		return;
	}

	async reverseReceiveDoc(
		id: number,
		id_document: number,
		empresa_id: number,
	) {
		if (Number.isNaN(id) || Number.isNaN(id_document))
			throw new BadRequestException('Documento não encontrado');

		const documento = await this.prisma.maloteDocumento.findFirst({
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
				id: id_document,
				malote_virtual_id: id,
				estornado: false,
				finalizado: true,
				malote_virtual: { excluido: false, empresa_id },
			},
		});

		if (!documento)
			throw new BadRequestException('Documento não encontrado');

		await this.prisma.maloteDocumento.updateMany({
			data: { finalizado: false },
			where: {
				malote_virtual_id: id,
				documento_id: id_document,
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

	async reverseDoc(ids: number, empresa_id: number) {
		if (Number.isNaN(ids) || Number.isNaN(ids)) {
			throw new BadRequestException('Documento não encontrado');
		}

		const documento = await this.prisma.maloteDocumento.findFirst({
			select: {
				id: true,
			},
			where: {
				id: id_document,
				malote_virtual_id: id,
				estornado: false,
				finalizado: false,
				malote_virtual: {
					excluido: false,
					empresa_id,
					finalizado: false,
				},
			},
		});

		if (!documento)
			throw new BadRequestException('Documento não encontrado');

		await this.prisma.maloteDocumento.update({
			data: { estornado: true },
			where: {
				id: id_document,
			},
		});

		await this.prisma.documentoFilaGeracao.updateMany({
			data: {
				gerado: false,
			},
			where: {
				documento_id: id_document,
			},
		});

		const malote = await this.prisma.maloteVirtual.findUnique({
			select: {
				documentos_malote: {
					select: {
						id: true,
					},
					where: { estornado: false },
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
