import { Injectable } from '@nestjs/common';
import { CreateQueueGeneratePackageDto } from './dto/create-queue-generate-package.dto';
import { UpdateQueueGeneratePackageDto } from './dto/update-queue-generate-package.dto';
import { PrismaService } from 'src/shared/services/prisma.service';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { FilterQueueGeneratePackageDto } from './dto/filter-queue-generate-package.dto';

@Injectable()
export class QueueGeneratePackageService {
	constructor(private readonly prisma: PrismaService) {}

	create(createQueueGeneratePackageDto: CreateQueueGeneratePackageDto) {
		const documentos_ids: Array<{ documento_id }> = [];
		createQueueGeneratePackageDto.documentos_ids.forEach(
			(documentos_id) => {
				documentos_ids.push({ documento_id: documentos_id });
			},
		);
		return this.prisma.documentoFilaGeracao.createMany({
			data: documentos_ids,
		});
	}

	async findAll(user: UserAuth, filters: FilterQueueGeneratePackageDto) {
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
				fila_geracao_malote: {
					some: {
						gerado: false,
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

	update(
		id: number,
		updateQueueGeneratePackageDto: UpdateQueueGeneratePackageDto,
	) {
		return `This action updates a #${id} queueGeneratePackage`;
	}

	remove(id: number) {
		return `This action removes a #${id} queueGeneratePackage`;
	}
}
