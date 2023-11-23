import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { FilterQueueGeneratePackageDto } from './dto/filter-queue-generate-package.dto';
import { CreateQueueGeneratePackageDto } from './dto/create-queue-generate-package.dto';
import { VirtualPackageSituation } from 'src/shared/consts/virtual-package-situation.const';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { ProtocolHistorySituation } from 'src/shared/consts/protocol-history-situation.const';

@Injectable()
export class QueueGeneratePackageService {
	constructor(private readonly prisma: PrismaService) {}

	async create(
		createQueueGeneratePackageDto: CreateQueueGeneratePackageDto,
		user: UserAuth,
	) {
		const documents = await this.prisma.protocoloDocumento.findMany({
			where: {
				excluido: false,
				id: {
					in: createQueueGeneratePackageDto.documentos_ids,
				},
				aceito: true,
				rejeitado: false,
				fila_geracao_malote: {
					none: {
						documento_id: {
							in: createQueueGeneratePackageDto.documentos_ids,
						},
						excluido: false,
					},
				},
				protocolo: {
					protocolo_malote: false,
				},
				condominio: {
					empresa_id: user.empresa_id,
				},
			},
		});

		if (!documents.length) {
			throw new BadRequestException(
				'Documentos aceitos não foram encontrados ou já estão na fila.',
			);
		}

		await this.prisma.documentoFilaGeracao.createMany({
			data: documents.map((document) => ({
				empresa_id: user.empresa_id,
				documento_id: document.id,
			})),
		});

		await this.prisma.protocoloDocumentoHistorico.createMany({
			data: documents.map((document) => ({
				documento_id: document.id,
				usuario_id: user.id,
				situacao: ProtocolHistorySituation.ENVIADO_FILA,
			})),
		});

		return;
	}

	async findAll(empresa_id: number, filters: FilterQueueGeneratePackageDto) {
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
			if (index == filters.dia - 1) daysSelected[key] = true;
		});

		const documentos = await this.prisma.protocoloDocumento.findMany({
			distinct: ['condominio_id'],
			select: {
				condominio: {
					select: {
						id: true,
						nome: true,
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
									where: {
										excluido: false,
									},
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
						setup_rotas: {
							select: {
								quantidade_malotes: true,
							},
						},
						condominio_malotes_virtuais: {
							select: {
								id: true,
								malote_fisico: {
									select: {
										id: true,
										codigo: true,
									},
								},
							},
							where: {
								malote_fisico_id: { not: null },
								situacao: VirtualPackageSituation.PENDENTE,
								excluido: false,
							},
						},
					},
				},
			},

			where: {
				condominio: {
					setup_rotas: {
						rota: daysSelected,
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

		return documentos.map((documento) => {
			return {
				condominio: {
					...documento.condominio,
					condominio_malotes_virtuais: undefined,
					setup_rotas: undefined,
					alerta_limite_malote:
						documento.condominio.condominio_malotes_virtuais
							.length >=
						documento.condominio.setup_rotas.quantidade_malotes,
				},
			};
		});
	}

	async remove(id: number, user: UserAuth) {
		if (Number.isNaN(id)) {
			throw new BadRequestException(
				'Documento na fila de geração de malotes não encontrado',
			);
		}

		const documentQueueExists =
			await this.prisma.documentoFilaGeracao.findFirst({
				where: {
					id,
					empresa_id: user.empresa_id,
					excluido: false,
				},
			});

		if (!documentQueueExists) {
			throw new BadRequestException(
				'Documento na fila de geração de malotes não encontrado',
			);
		}

		const document = await this.prisma.documentoFilaGeracao.update({
			where: {
				id,
			},
			data: {
				excluido: true,
			},
		});

		await this.prisma.protocoloDocumentoHistorico.create({
			data: {
				documento_id: id,
				usuario_id: user.id,
				situacao: ProtocolHistorySituation.ESTORNO_FILA,
			},
		});

		return document;
	}
}
