import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePhysicalPackageDto } from './dto/create-physical-package.dto';
import { UpdatePhysicalPackageDto } from './dto/update-physical-package.dto';
import { PrismaService } from 'src/shared/services/prisma.service';
import { FiltersPhysicalPackage } from './dto/filters-physical-package.dto';
import { Pagination } from 'src/shared/entities/pagination.entity';

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
		if (empresa_id === null || !Number.isNaN(empresa_id)) {
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
				disponivel: filters.disponivel ? filters.disponivel : undefined,
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
		if (id === null || !Number.isNaN(id)) {
			throw new BadRequestException(
				'O id do malote físico deve ser informado',
			);
		}
		return this.prisma.malotesFisicos.findUnique({
			where: {
				id,
			},
		});
	}

	async update(
		id: number,
		updatePhysicalPackageDto: UpdatePhysicalPackageDto,
	) {
		if (id === null || !Number.isNaN(id)) {
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
