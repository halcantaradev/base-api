import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { FilterQueueGeneratePackageDto } from './dto/filter-queue-generate-package.dto';

@Injectable()
export class QueueGeneratePackageService {
	constructor(private readonly prisma: PrismaService) {}

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
