import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateQueueGeneratePackageDto } from './dto/create-queue-generate-package.dto';
import { UpdateQueueGeneratePackageDto } from './dto/update-queue-generate-package.dto';
import { PrismaService } from 'src/shared/services/prisma.service';
import { FilterQueueGeneratePackageDto } from './dto/filter-queue-generate-package.dto';

@Injectable()
export class QueueGeneratePackageService {
	constructor(private readonly prisma: PrismaService) {}

	async findAll(empresa_id: number, filters: FilterQueueGeneratePackageDto) {
		const documentos = await this.prisma.protocoloDocumento.findMany({
			select: {
				condominio: {
					select: {
						id: true,
						nome: true,

						protocolos_documentos_condominio: {
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
						rota_id: filters.rota_id ? filters.rota_id : undefined,
					},
				},
				fila_geracao_malote: {
					some: {
						gerado: false,
						empresa_id,
					},
				},
			},
			orderBy: {
				condominio_id: 'asc',
			},
		});

		return documentos;
	}

	findOne(id: number) {
		return `This action returns a #${id} queueGeneratePackage`;
	}
}
