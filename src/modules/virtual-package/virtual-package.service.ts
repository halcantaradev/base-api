import { setCustomHour } from 'src/shared/helpers/date.helper';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreateVirtualPackageDto } from './dto/create-virtual-package.dto';
import { FiltersVirtualPackageDto } from './dto/filters-virtual-package.dto';
import { VirtualPackageType } from 'src/shared/consts/report-virtual-package-tyoe.const';
import { Prisma } from '@prisma/client';

@Injectable()
export class VirtualPackageService {
	constructor(private readonly prisma: PrismaService) {}

	async create(
		createVirtualPackageDto: CreateVirtualPackageDto,
		empresa_id: number,
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
						empresa_id,
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
				empresa_id,
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
				empresa_id,
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

	async findBy(type: number, filters: FiltersVirtualPackageDto) {
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
			documentos_malote: {
				where: {
					documento: {
						retorna: filters.documento_retorna
							? filters.documento_retorna
							: undefined,
					},
				},
			},
		};

		const data = await this.prisma.maloteVirtual.findMany({
			select:
				type === VirtualPackageType.SINTETICO
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
			},
		});

		return data;
	}

	async findSetupData(empresa_id: number) {
		const data = await this.prisma.sistemaSetup.findFirst({
			select: {
				usa_malote_fisico: true,
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
