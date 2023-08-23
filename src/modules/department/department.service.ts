import { FiltersDepartmentDto } from './dto/filters-department.dto';
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { PrismaService } from 'src/shared/services/prisma.service';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class DepartmentService {
	constructor(private readonly prisma: PrismaService) {}

	select: Prisma.DepartamentoSelect = {
		id: true,
		filial: {
			select: {
				id: true,
				nome: true,
			},
		},
		nome: true,
		nac: true,
		ativo: true,
	};

	async create(empresa_id: number, createDepartmentDto: CreateDepartmentDto) {
		return this.prisma.departamento.create({
			data: {
				nome: createDepartmentDto.nome,
				nac: createDepartmentDto.nac || false,
				empresa_id,
				filial_id: createDepartmentDto.filial_id,
			},
		});
	}

	async findAll(
		user: UserAuth,
		filters: FiltersDepartmentDto,
		usuario_id?: number,
		all = false,
	) {
		let departamentos;
		if (!all) {
			const idUser =
				usuario_id && !Number.isNaN(usuario_id) ? usuario_id : user.id;

			const userData = await this.prisma.user.findFirst({
				include: {
					departamentos: {
						select: {
							departamento_id: true,
						},
					},
				},
				where: {
					id: idUser,
				},
			});

			if (!userData.acessa_todos_departamentos) {
				departamentos = userData.departamentos.map(
					(departamento) => departamento.departamento_id,
				);
			}
		}

		return this.prisma.departamento.findMany({
			select: this.select,
			where: {
				id: departamentos
					? {
							in: departamentos,
					  }
					: undefined,
				empresa_id: user.empresa_id,
				OR: filters.busca
					? [
							{
								nome: {
									contains: filters.busca,
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
				nac: filters.nac != null ? filters.nac : undefined,
				ativo: filters.ativo != null ? filters.ativo : undefined,
				excluido: false,
			},
		});
	}

	async findOne(id: number, user: UserAuth) {
		if (
			!user.departamentos_ids.includes(id) &&
			!user.acessa_todos_departamentos
		)
			return null;

		return this.prisma.departamento.findFirst({
			select: this.select,
			where: {
				id,
				empresa_id: user.empresa_id,
				excluido: false,
			},
		});
	}

	async update(
		id: number,
		user: UserAuth,
		updateDepartmentDto: UpdateDepartmentDto,
	) {
		if (
			!user.departamentos_ids.includes(id) &&
			!user.acessa_todos_departamentos
		)
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
			select: this.select,
			data: {
				nac: updateDepartmentDto.nac,
				nome: updateDepartmentDto.nome,
				ativo: updateDepartmentDto.ativo,
				filial_id: updateDepartmentDto.filial_id,
			},
			where: {
				id,
			},
		});
	}

	async delete(id: number, user: UserAuth) {
		if (
			!user.departamentos_ids.includes(id) &&
			!user.acessa_todos_departamentos
		)
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
