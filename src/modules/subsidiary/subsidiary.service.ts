import { FiltersSubsidiaryDto } from './dto/filters-subsidiary.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubsidiaryDto } from './dto/create-subsidiary.dto';
import { UpdateSubsidiaryDto } from './dto/update-subsidiary.dto';
import { PrismaService } from 'src/shared/services/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubsidiaryService {
	constructor(private readonly prisma: PrismaService) {}

	select: Prisma.FilialSelect = {
		id: true,
		nome: true,
		ativo: true,
	};

	create(empresa_id: number, createSubsidiaryDto: CreateSubsidiaryDto) {
		return this.prisma.filial.create({
			select: this.select,
			data: {
				nome: createSubsidiaryDto.nome,
				ativo:
					createSubsidiaryDto.ativo != null
						? createSubsidiaryDto.ativo
						: true,
				empresa_id,
			},
		});
	}

	findAll(empresa_id: number, filtersSubsidiaryDto: FiltersSubsidiaryDto) {
		return this.prisma.filial.findMany({
			select: this.select,
			where: {
				empresa_id,
				OR: filtersSubsidiaryDto.busca
					? [
							{
								nome: {
									contains: filtersSubsidiaryDto.busca,
								},
							},
							!Number.isNaN(+filtersSubsidiaryDto.busca)
								? {
										id: +filtersSubsidiaryDto.busca,
								  }
								: null,
					  ].filter((filtro) => !!filtro)
					: undefined,
				ativo:
					filtersSubsidiaryDto.ativo != null
						? filtersSubsidiaryDto.ativo
						: undefined,
			},
		});
	}

	findOne(id: number, empresa_id: number) {
		return this.prisma.filial.findFirst({
			select: this.select,
			where: {
				id,
				empresa_id,
			},
		});
	}

	async update(
		id: number,
		empresa_id: number,
		updateSubsidiaryDto: UpdateSubsidiaryDto,
	) {
		const filial = await this.findOne(id, empresa_id);

		if (!filial)
			throw new BadRequestException(
				'Ocorreu um erro ao atualizar os dados',
			);

		return this.prisma.filial.update({
			select: this.select,
			data: {
				nome: updateSubsidiaryDto.nome,
				ativo:
					updateSubsidiaryDto.ativo != null
						? updateSubsidiaryDto.ativo
						: true,
				empresa_id,
			},
			where: {
				id,
			},
		});
	}
}
