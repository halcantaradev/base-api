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

		await this.prisma.documentoFilaGeracao.updateMany({
			data: {
				gerado: true,
			},
			where: {
				documento_id: { in: createVirtualPackageDto.documentos_ids },
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

	findAllPending(empresa_id: number) {
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

	async reverseDoc(id: number, id_document: number) {
		if (Number.isNaN(id) || Number.isNaN(id_document))
			throw new BadRequestException('Documento não encontrado');

		const documento = await this.prisma.maloteDocumento.findFirst({
			select: {
				id: true,
			},
			where: {
				id: id_document,
				malote_id: id,
				estornado: false,
				malote: { excluido: false },
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

		return { success: true, message: 'Malote removida com sucesso!' };
	}
}
