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
				empresa_id,
			},
		});
	}

	async findAll(empresa_id: number) {
		return this.prisma.departamento.findMany({
			select: {
				id: true,
				nome: true,
				nac: true,
			},
			where: {
				empresa_id,
				ativo: true,
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
			},
			data: {
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
