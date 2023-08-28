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

@Injectable()
export class ProtocolService {
	constructor(private readonly prisma: PrismaService) {}

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
		aceite: true,
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

	findBy(
		filtersProtocolDto: FiltersProtocolDto,
		user: UserAuth,
		pagination?: Pagination,
	) {
		return this.prisma.protocolo.findMany({
			select: this.select,
			take: !filtersProtocolDto && pagination?.page ? 20 : 100,
			skip:
				!filtersProtocolDto && pagination?.page
					? (pagination?.page - 1) * 20
					: undefined,
			where: {
				OR:
					filtersProtocolDto.id || !user.acessa_todos_departamentos
						? [
								{
									id: !Number.isNaN(+filtersProtocolDto.id)
										? +filtersProtocolDto.id
										: undefined,
								},
								{
									destino_departamento: {
										id: filtersProtocolDto.destino_departamento_ids
											? {
													in: filtersProtocolDto.destino_departamento_ids,
											  }
											: undefined,
										usuarios:
											!user.acessa_todos_departamentos
												? {
														some: {
															usuario: {
																id: user.id,
															},
														},
												  }
												: undefined,
									},
								},
						  ]
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
				origem_departamento: {
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
				},
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
			},
			orderBy: {
				id: 'desc',
			},
		});
	}

	findById(id: number, user: UserAuth) {
		if (Number.isNaN(id))
			throw new BadRequestException('Protocolo não encontrado');

		return this.prisma.protocolo.findFirst({
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
	}

	async update(
		id: number,
		updateProtocolDto: UpdateProtocolDto,
		user: UserAuth,
	) {
		const protocolo = await this.findById(id, user);

		if (!protocolo || protocolo.situacao != 1)
			throw new BadRequestException('Protocolo não encontrado');

		console.log({
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
		});

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

	async findAllDocuments(protocolo_id: number, user: UserAuth) {
		const protocolo = await this.findById(protocolo_id, user);

		if (!protocolo || Number.isNaN(protocolo_id))
			throw new BadRequestException('Protocolo não encontrado');

		return this.prisma.protocoloDocumento.findMany({
			select: this.selectDocuments,
			where: {
				protocolo_id,
				excluido: false,
			},
		});
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

		if (!document || Number.isNaN(document_id) || document.aceite)
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
}
