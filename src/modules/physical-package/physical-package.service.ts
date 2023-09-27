import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePhysicalPackageDto } from './dto/create-physical-package.dto';
import { UpdatePhysicalPackageDto } from './dto/update-physical-package.dto';
import { PrismaService } from 'src/shared/services/prisma.service';
import { FiltersPhysicalPackage } from './dto/filters-physical-package.dto';

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
			data: { empresa_id, ...createPhysicalPackageDto },
		});
	}

	async findAll(
		empresa_id: number,
		filters: FiltersPhysicalPackage,
		page: number,
	) {
		const data = await this.prisma.malotesFisicos.findMany({
			take: 20,
			skip: (page - 1) * 10,
			where: {
				empresa_id,
				...filters,
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
			data,
			disponiveis,
			em_uso,
			total,
		};
	}

	findOne(id: number) {
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
			data: updatePhysicalPackageDto,
		});
	}

	remove(id: number) {
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
