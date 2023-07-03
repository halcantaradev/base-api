import { FiltersDepartmentDto } from './dto/filters-department.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class DepartmentService {
	constructor(private readonly prisma: PrismaService) {}

	async create(empresa_id: number, createDepartmentDto: CreateDepartmentDto) {
		return this.prisma.departamento.create({
			data: {
				nome: createDepartmentDto.nome,
				nac: createDepartmentDto.nac,
				empresa_id,
			},
		});
	}

	async findAll(empresa_id: number, filters: FiltersDepartmentDto) {
		return this.prisma.departamento.findMany({
			select: {
				id: true,
				nome: true,
				nac: true,
				ativo: true,
			},
			where: {
				empresa_id,
				OR: filters.busca
					? [
							{
								nome: {
									contains: filters.busca
										.toString()
										.normalize('NFD')
										.replace(/[\u0300-\u036f]/g, ''),
									mode: 'insensitive',
								},
							},
							{
								id: !Number.isNaN(+filters.busca)
									? +filters.busca
									: undefined,
							},
					  ]
					: undefined,
				nac: filters.nac != null ? filters.nac : true,
				ativo: filters.ativo != null ? filters.ativo : true,
				excluido: false,
			},
		});
	}

	async findOne(id: number, empresa_id: number) {
		return this.prisma.departamento.findFirst({
			select: {
				id: true,
				nome: true,
				nac: true,
				ativo: true,
			},
			where: {
				id,
				empresa_id,
				ativo: true,
				excluido: false,
			},
		});
	}

	async update(
		id: number,
		empresa_id: number,
		updateDepartmentDto: UpdateDepartmentDto,
	) {
		const department = await this.prisma.departamento.findFirst({
			where: {
				id,
				empresa_id,
				excluido: false,
			},
		});

		if (!department)
			throw new NotFoundException('Departamento não encontrado');

		return this.prisma.departamento.update({
			select: {
				id: true,
				nome: true,
				nac: true,
				ativo: true,
			},
			data: {
				nac: updateDepartmentDto.nac,
				nome: updateDepartmentDto.nome,
				ativo: updateDepartmentDto.ativo,
			},
			where: {
				id,
			},
		});
	}

	async delete(id: number, empresa_id: number) {
		const department = await this.prisma.departamento.findFirst({
			where: {
				id,
				empresa_id,
				excluido: false,
			},
		});

		if (!department)
			throw new NotFoundException('Departamento não encontrado');

		return this.prisma.departamento.update({
			data: {
				excluido: true,
			},
			where: {
				id,
			},
		});
	}
}
