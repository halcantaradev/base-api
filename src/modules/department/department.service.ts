import { FiltersDepartmentDto } from './dto/filters-department.dto';
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { PrismaService } from 'src/shared/services/prisma.service';
import { UserAuth } from 'src/shared/entities/user-auth.entity';

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

	async findAll(user: UserAuth, filters: FiltersDepartmentDto) {
		return this.prisma.departamento.findMany({
			select: {
				id: true,
				nome: true,
				nac: true,
				ativo: true,
			},
			where: {
				id: !user.acessa_todos_departamentos
					? {
							in: [...user.departamentos_ids],
					  }
					: undefined,
				empresa_id: user.empresa_id,
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

	async findOne(id: number, user: UserAuth) {
		if (!user.departamentos_ids.includes(id)) return null;

		return this.prisma.departamento.findFirst({
			select: {
				id: true,
				nome: true,
				nac: true,
				ativo: true,
			},
			where: {
				id,
				empresa_id: user.empresa_id,
				ativo: true,
				excluido: false,
			},
		});
	}

	async update(
		id: number,
		user: UserAuth,
		updateDepartmentDto: UpdateDepartmentDto,
	) {
		if (!user.departamentos_ids.includes(id))
			throw new BadRequestException('Departamento não encontrado');

		const department = await this.prisma.departamento.findFirst({
			where: {
				id,
				empresa_id: user.empresa_id,
				excluido: false,
			},
		});

		if (!department)
			throw new BadRequestException('Departamento não encontrado');

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

	async delete(id: number, user: UserAuth) {
		if (!user.departamentos_ids.includes(id))
			throw new BadRequestException('Departamento não encontrado');

		const department = await this.prisma.departamento.findFirst({
			where: {
				id,
				empresa_id: user.empresa_id,
				excluido: false,
			},
		});

		if (!department)
			throw new BadRequestException('Departamento não encontrado');

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
