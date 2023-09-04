import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
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

@Injectable()
export class ProtocolService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly pessoaService: PersonService,
	) {}

	select: Prisma.ProtocoloSelect = {
		id: true,
		tipo: true,
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
		documentos: true,
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
			},
		},

		retorna_malote_vazio: true,
		ativo: true,
		situacao: true,

		finalizado: true,
		data_finalizado: true,
		created_at: true,
		updated_at: true,
	};

	selectDocuments: Prisma.ProtocoloDocumentoSelect = {
		id: true,
		protocolo_id: true,
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
		data_aceite: true,
		aceito: true,
		created_at: true,
		updated_at: true,
	};

	create(createProtocolDto: CreateProtocolDto, user: UserAuth) {
		return this.prisma.protocolo.create({
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
				ativo: true,
			},
		});
	}

	async findBy(
		filtersProtocolDto: FiltersProtocolDto,
		user: UserAuth,
		pagination?: Pagination,
	) {
		return await this.prisma.protocolo.findMany({
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
				documentos:
					filtersProtocolDto.condominios_ids ||
					filtersProtocolDto?.aceito_por
						? {
								some: {
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
								},
						  }
						: undefined,
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
	}
	async findByAccept(
		filtersProtocolDto: FiltersProtocolDto,
		user: UserAuth,
		pagination?: Pagination,
	) {
		return await this.prisma.protocolo.findMany({
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
				documentos:
					filtersProtocolDto.condominios_ids ||
					filtersProtocolDto?.aceito_por
						? {
								some: {
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
								},
						  }
						: undefined,
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

	findById(id: number, user: UserAuth) {
		if (Number.isNaN(id))
			throw new BadRequestException('Protocolo não encontrado');

		return this.prisma.protocolo.findFirst({
			select: this.select,
			where: {
				id,
				excluido: false,
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
					: undefined,
			},
		});
	}

	async update(
		id: number,
		updateProtocolDto: UpdateProtocolDto,
		user: UserAuth,
	) {
		const protocolo = await this.findById(id, user);

		if (!protocolo || protocolo.situacao != 1)
			throw new BadRequestException('Protocolo não encontrado');

		return this.prisma.protocolo.update({
			data: {
				tipo: updateProtocolDto.tipo || undefined,
				destino_departamento_id:
					updateProtocolDto.destino_departamento_id || undefined,
				destino_usuario_id: updateProtocolDto.destino_usuario_id,
				origem_usuario_id: updateProtocolDto.origem_departamento_id
					? user.id
					: undefined,
				origem_departamento_id:
					updateProtocolDto.origem_departamento_id || undefined,
				retorna_malote_vazio:
					updateProtocolDto.retorna_malote_vazio || undefined,
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
	}

	async createDocument(
		protocolo_id: number,
		createDocumentProtocolDto: CreateDocumentProtocolDto,
		user: UserAuth,
	) {
		const protocolo = await this.findById(protocolo_id, user);

		if (!protocolo || Number.isNaN(protocolo_id))
			throw new BadRequestException('Protocolo não encontrado');

		return this.prisma.protocoloDocumento.create({
			data: {
				protocolo_id,
				discriminacao: createDocumentProtocolDto.discriminacao,
				observacao: createDocumentProtocolDto.observacao || null,
				condominio_id: createDocumentProtocolDto.condominio_id,
				tipo_documento_id: createDocumentProtocolDto.tipo_documento_id,
			},
		});
	}

	async findAllDocuments(protocolo_id: number, user?: UserAuth) {
		const protocolo = await this.findById(protocolo_id, user);

		if (!protocolo || Number.isNaN(protocolo_id))
			throw new BadRequestException('Protocolo não encontrado');

		return this.prisma.protocoloDocumento.findMany({
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
		});
	}

	async getDataHandleToPrint(id: number, user: UserAuth) {
		const protocol = await this.prisma.protocolo.findUnique({
			where: {
				id,
			},
		});
		const total_documentos = await this.prisma.protocoloDocumento.count({
			where: {
				protocolo_id: id,
			},
		});
		const documentsProtocol = await this.findAllDocuments(id, user);
		const empresa = await this.prisma.user.findUnique({
			select: {
				empresas: {
					select: {
						empresa: {
							select: {
								nome: true,
								temas: {
									select: {
										logo: true,
									},
								},
							},
						},
					},
				},
			},
			where: {
				id: user.id,
			},
		});
		const data: any = {};
		data.data_atual_extenso = new Intl.DateTimeFormat('pt-BR', {
			dateStyle: 'long',
		}).format(new Date());
		data.numero_protocolo = protocol.id;
		data.total_documentos_protocolo = total_documentos;
		data.empresa_nome = empresa.empresas[0].empresa.nome || '';
		data.empresa_logo = empresa.empresas[0]?.empresa?.temas[0]?.logo;

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
				origem: 2,
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
		const documentExists = await this.prisma.protocoloDocumento.findMany({
			where: {
				protocolo_id: protocol_id,
				excluido: false,
				id: {
					in: documents_ids,
				},
				aceito: false,
				condominio: !user.acessa_todos_departamentos
					? {
							usuarios_condominio: {
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

		if (!documentExists.length) {
			throw new BadRequestException(
				'Documentos informado(s) já aceitos ou não encontrados',
			);
		}

		const documents_ids_accept = documentExists.map(
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
				data_aceite: new Date(),
			},
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
				situacao: !protocolTotalDocuments.length ? 3 : 2,
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
		const documentExists = await this.prisma.protocoloDocumento.findMany({
			where: {
				protocolo_id: protocol_id,
				condominio: !user.acessa_todos_departamentos
					? {
							usuarios_condominio: {
								some: {
									usuario: {
										id: user.id,
									},
								},
							},
					  }
					: undefined,
				id: {
					in: documents_ids,
				},
				aceito: true,
			},
		});

		if (!documentExists.length) {
			throw new BadRequestException(
				'Documento(s) informado(s) não aceitos ou não encontrados',
			);
		}

		const documents_ids_reverse = documentExists.map(
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
				data_aceite: null,
			},
		});

		const protocolTotalDocuments =
			await this.prisma.protocoloDocumento.findMany({
				where: {
					protocolo_id: protocol_id,
					excluido: false,
					aceito: true,
				},
			});

		await this.prisma.protocolo.update({
			where: {
				id: protocol_id,
			},
			data: {
				situacao: !protocolTotalDocuments.length ? 1 : 2,
			},
		});

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

		const document = await this.findDocumentById(
			protocolo_id,
			document_id,
			user,
		);

		if (!document || Number.isNaN(document_id) || document.aceito)
			throw new BadRequestException('Documento não encontrado');

		return this.prisma.protocoloDocumento.update({
			data: {
				discriminacao: updateDocumentProtocolDto.discriminacao,
				observacao: updateDocumentProtocolDto.observacao,
				condominio_id: updateDocumentProtocolDto.condominio_id,
				tipo_documento_id: updateDocumentProtocolDto.tipo_documento_id,
				excluido: exclude,
			},
			where: {
				id: document_id,
			},
		});
	}

	async findAllCondominiums(
		filtersProtocolCondominiumDto: FiltersProtocolCondominiumDto,
		condominiums: number[],
		user: UserAuth,
	) {
		const departamento = await this.prisma.departamento.findFirst({
			where: {
				id: filtersProtocolCondominiumDto.departamento_id,
				empresa_id: user.empresa_id,
			},
		});

		if (!departamento) return [];

		return (
			await this.pessoaService.findAll(
				'condominio',
				{},
				{
					id:
						departamento.nac && !user.acessa_todos_departamentos
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
						some: departamento.nac
							? {
									departamento_id:
										filtersProtocolCondominiumDto.departamento_id,
							  }
							: {},
					},
					empresa_id: user.empresa_id,
					ativo: true,
				},
			)
		).data;
	}
}
