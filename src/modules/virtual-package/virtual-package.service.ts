import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreateVirtualPackageDto } from './dto/create-virtual-package.dto';

@Injectable()
export class VirtualPackageService {
	constructor(private readonly prisma: PrismaService) {}

	async create(
		createVirtualPackageDto: CreateVirtualPackageDto,
		empresa_id: number,
	) {
		const hasDoc = await this.prisma.maloteVirtual.findFirst({
			where: {
				empresa_id,
				condominio_id: createVirtualPackageDto.condominio_id,
				documentos_malote: {
					some: {
						documento_id: {
							in: createVirtualPackageDto.documentos_ids,
						},
					},
				},
			},
		});
		if (hasDoc)
			throw new BadRequestException(
				'Existe um ou mais documentos com malotes já gerados!',
			);

		const hasDocPending = await this.prisma.protocoloDocumento.findFirst({
			where: {
				id: { in: createVirtualPackageDto.documentos_ids },
				aceito: false,
			},
		});
		if (hasDocPending)
			throw new BadRequestException(
				'Existe um ou mais documentos ainda pendente de aceite!',
			);

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

		const malote = await this.prisma.maloteVirtual.create({
			data: {
				empresa_id,
				condominio_id: createVirtualPackageDto.condominio_id,
				malote_fisico_id: createVirtualPackageDto.malote_fisico_id,
				documentos_malote: {
					createMany: {
						data: createVirtualPackageDto.documentos_ids.map(
							(doc_id) => ({
								documento_id: doc_id,
							}),
						),
					},
				},
			},
		});

		if (malote && malote.malote_fisico_id) {
			await this.prisma.malotesFisicos.update({
				data: { disponivel: false },
				where: { id: malote.malote_fisico_id },
			});
		}

		return { success: true, message: 'Malote gerado com successo!' };
	}

	findAllActive(empresa_id: number) {
		return this.prisma.maloteVirtual.findMany({
			select: {
				condominio: { select: { nome: true } },
				malote_fisico: { select: { codigo: true } },
				finalizado: true,
				id: true,
				documentos_malote: { select: { documento: true } },
			},
			where: { empresa_id, finalizado: false, excluido: false },
		});
	}

	async remove(id: number) {
		const malote = await this.prisma.maloteVirtual.findUnique({
			where: { id },
		});
		if (!malote) throw new BadRequestException('Malote não encontrado');

		return { success: true, message: 'Malote removida com sucesso!' };
	}
}
