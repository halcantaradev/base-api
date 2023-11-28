import { BadRequestException, Injectable } from '@nestjs/common';
import { Pagination } from 'src/shared/entities/pagination.entity';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { CreatePhysicalPackageDto } from './dto/create-physical-package.dto';
import { FiltersPhysicalPackage } from './dto/filters-physical-package.dto';
import { UpdatePhysicalPackageDto } from './dto/update-physical-package.dto';

@Injectable()
export class PhysicalPackageService {
	constructor(private readonly prisma: PrismaService) {}
	async create(
		empresa_id: number,
		createPhysicalPackageDto: CreatePhysicalPackageDto,
	) {
		const packageAlreadyExists = await this.prisma.malotesFisicos.findFirst(
			{
				where: {
					empresa_id,
					codigo: createPhysicalPackageDto.codigo,
					excluido: false,
				},
			},
		);

		if (packageAlreadyExists) {
			throw new BadRequestException('Malote com esse código já existe');
		}

		return this.prisma.malotesFisicos.create({
			data: {
				empresa_id,
				codigo: createPhysicalPackageDto.codigo,
				alerta: createPhysicalPackageDto.alerta,
			},
		});
	}

	async findAll(
		empresa_id: number,
		filters: FiltersPhysicalPackage,
		pagination?: Pagination,
	) {
		if (Number.isNaN(empresa_id)) {
			throw new BadRequestException('O id da empresa deve ser informado');
		}

		let page;

		if (pagination === null) {
			page = null;
		} else if (pagination?.page) {
			page = pagination.page;
		}
		const data = await this.prisma.malotesFisicos.findMany({
			take: page !== null ? (page ? 20 : 100) : undefined,
			skip: page ? (page - 1) * 20 : undefined,
			where: {
				empresa_id,
				codigo: filters.codigo ? filters.codigo : undefined,
				disponivel: filters.disponivel,
				ativo: filters.ativo ? filters.ativo : undefined,
				excluido: false,
			},
		});

		const total_pages = await this.prisma.malotesFisicos.count({
			where: {
				empresa_id,
				codigo: filters.codigo ? filters.codigo : undefined,
				disponivel: filters.disponivel ? filters.disponivel : undefined,
				ativo: filters.ativo ? filters.ativo : undefined,
				excluido: false,
			},
		});

		const em_uso = await this.prisma.malotesFisicos.count({
			where: {
				empresa_id,
				disponivel: false,
				excluido: false,
			},
		});

		const total = await this.prisma.malotesFisicos.count({
			where: {
				empresa_id,
				excluido: false,
			},
		});

		const disponiveis = await this.prisma.malotesFisicos.count({
			where: {
				empresa_id,
				disponivel: true,
				excluido: false,
			},
		});
		return {
			total_pages,
			data,
			disponiveis,
			em_uso,
			total,
		};
	}

	findOne(id: number) {
		if (Number.isNaN(id)) {
			throw new BadRequestException(
				'O id do malote físico deve ser informado',
			);
		}
		return this.prisma.maloteVirtual.findFirst({
			include: {
				malote_fisico: true,
				condominio: {
					select: {
						nome: true,
						endereco: true,
						numero: true,
						bairro: true,
						setup_rotas: {
							select: {
								motoqueiro: {
									select: {
										nome: true,
										telefone: true,
										whatsapp: true,
									},
								},
							},
						},
					},
				},
				_count: {
					select: {
						documentos_malote: true,
					},
				},
			},
			where: {
				malote_fisico_id: id,
				excluido: false,
			},
			orderBy: {
				id: 'desc',
			},
		});
	}

	async update(
		id: number,
		updatePhysicalPackageDto: UpdatePhysicalPackageDto,
	) {
		if (Number.isNaN(id)) {
			throw new BadRequestException(
				'O id do malote físico deve ser informado',
			);
		}
		const packageExists = await this.prisma.malotesFisicos.findFirst({
			where: {
				id,
				excluido: false,
			},
		});

		if (!packageExists) {
			throw new BadRequestException('Malote físico não encontrado');
		}

		const codeAlreadyExists = await this.prisma.malotesFisicos.findFirst({
			where: {
				id: { not: id },
				codigo: updatePhysicalPackageDto.codigo,
				alerta: updatePhysicalPackageDto.alerta,
				ativo: updatePhysicalPackageDto.ativo,
				excluido: false,
			},
		});

		if (codeAlreadyExists) {
			throw new BadRequestException('Malote com esse código já existe');
		}

		return this.prisma.malotesFisicos.update({
			where: {
				id,
			},
			data: {
				codigo: updatePhysicalPackageDto.codigo,
				alerta: updatePhysicalPackageDto.alerta,
				disponivel: updatePhysicalPackageDto.disponivel,
				ativo: updatePhysicalPackageDto.ativo,
			},
		});
	}

	remove(id: number) {
		if (id === null || !Number.isNaN(id)) {
			throw new BadRequestException(
				'O id do malote físico deve ser informado',
			);
		}
		const packageExists = this.prisma.malotesFisicos.findFirst({
			where: {
				id,
				excluido: false,
			},
		});

		if (!packageExists) {
			throw new BadRequestException(
				'Malote físico não encontrado ou já excluído',
			);
		}
		return this.prisma.malotesFisicos.update({
			where: {
				id,
			},
			data: {
				excluido: true,
			},
		});
	}
}
