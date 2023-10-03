import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { FilterQueueGeneratePackageDto } from './dto/filter-queue-generate-package.dto';
import { CreateQueueGeneratePackageDto } from './dto/create-queue-generate-package.dto';

@Injectable()
export class QueueGeneratePackageService {
	constructor(private readonly prisma: PrismaService) {}

	async create(
		createQueueGeneratePackageDto: CreateQueueGeneratePackageDto,
		empresa_id: number,
	) {
		if (Number.isNaN(empresa_id)) {
			throw new BadRequestException('Ocorreu um erro ao gerar a fila');
		}
		const documents = await this.prisma.protocoloDocumento.findMany({
			where: {
				excluido: false,
				id: {
					in: createQueueGeneratePackageDto.documentos_ids,
				},
				aceito: true,
				fila_geracao_malote: {
					none: {
						documento_id: {
							in: createQueueGeneratePackageDto.documentos_ids,
						},
					},
				},
				condominio: {
					empresa_id,
				},
			},
		});

		if (!documents.length) {
			throw new BadRequestException(
				'Documentos aceitos não foram encontrados ou já estão na fila.',
			);
		}

		return this.prisma.documentoFilaGeracao.createMany({
			data: documents.map((document) => ({
				empresa_id,
				documento_id: document.id,
			})),
		});
	}

	async findAll(empresa_id: number, filters: FilterQueueGeneratePackageDto) {
		const documentos = await this.prisma.protocoloDocumento.findMany({
			distinct: ['condominio_id'],
			select: {
				condominio: {
					select: {
						id: true,
						nome: true,
						setup_rotas: {
							select: {
								rota: true,
							},
						},
						protocolos_documentos_condominio: {
							include: {
								tipo_documento: {
									select: {
										id: true,
										nome: true,
									},
								},
								fila_geracao_malote: {
									select: { id: true },
								},
								aceite_usuario: {
									select: {
										id: true,
										nome: true,
									},
								},
							},
							where: {
								fila_geracao_malote: {
									some: {
										gerado: false,
										excluido: false,
									},
								},
							},
						},
					},
				},
			},

			where: {
				condominio: {
					setup_rotas: {
						rota_id: filters.rota_id ? filters.rota_id : undefined,
					},
				},
				fila_geracao_malote: {
					some: {
						gerado: false,
						empresa_id,
						excluido: false,
					},
				},
			},
			orderBy: {
				condominio_id: 'asc',
			},
		});

		return documentos;
	}

	async remove(id: number, empresa_id: number) {
		if (Number.isNaN(id)) {
			throw new BadRequestException(
				'Documento na fila de geração de malotes não encontrado',
			);
		}

		const documentQueueExists =
			await this.prisma.documentoFilaGeracao.findFirst({
				where: {
					id,
					empresa_id,
				},
			});

		if (!documentQueueExists) {
			throw new BadRequestException(
				'Documento na fila de geração de malotes não encontrado',
			);
		}

		return this.prisma.documentoFilaGeracao.update({
			where: {
				id,
			},
			data: {
				excluido: true,
			},
		});
	}
}
