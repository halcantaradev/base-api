import { UpdateInfractionDto } from './dto/update-infraction.dto';
import { CreateInfractionDto } from './dto/create-infraction.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { FilterInfractionDto } from './dto/filter-infraction.dto';
import { Prisma } from '@prisma/client';
import { UserAuth } from 'src/shared/entities/user-auth.entity';

@Injectable()
export class InfractionService {
	constructor(private readonly prisma: PrismaService) {}

	returnSelect: Prisma.TipoInfracaoSelect = {
		id: true,
		descricao: true,
		fundamentacao_legal: true,
		ativo: true,
	};

	create(user: UserAuth, createInfractionDto: CreateInfractionDto) {
		return this.prisma.tipoInfracao.create({
			select: this.returnSelect,
			data: {
				descricao: createInfractionDto.descricao,
				empresa_id: user.empresa_id,
				fundamentacao_legal:
					createInfractionDto?.fundamentacao_legal || undefined,
				ativo: createInfractionDto.ativo,
			},
		});
	}

	async findAll(user: UserAuth, filterInfractionDto: FilterInfractionDto) {
		return this.prisma.tipoInfracao.findMany({
			select: this.returnSelect,
			where: {
				descricao:
					filterInfractionDto.busca != null
						? {
								contains: filterInfractionDto.busca,
								mode: 'insensitive',
						  }
						: undefined,
				empresa_id: user.empresa_id,
				ativo:
					filterInfractionDto.ativo != null
						? filterInfractionDto.ativo
						: undefined,
			},
			orderBy: {
				descricao: 'asc',
			},
		});
	}

	async findOneById(id: number, user: UserAuth) {
		if (Number.isNaN(id))
			throw new BadRequestException('Tipo de infração não encontrado');

		const tipoInfracao = await this.prisma.tipoInfracao.findFirst({
			select: this.returnSelect,
			where: {
				id,
				empresa_id: user.empresa_id,
			},
		});

		if (!tipoInfracao)
			throw new BadRequestException('Tipo de infração não encontrado');

		return tipoInfracao;
	}

	async update(
		id: number,
		user: UserAuth,
		updateInfractionDto: UpdateInfractionDto,
	) {
		await this.findOneById(id, user);

		return this.prisma.tipoInfracao.update({
			select: this.returnSelect,
			data: {
				descricao: updateInfractionDto.descricao || undefined,
				fundamentacao_legal:
					updateInfractionDto?.fundamentacao_legal || undefined,
				ativo:
					updateInfractionDto.ativo != null
						? updateInfractionDto.ativo
						: undefined,
			},
			where: {
				id,
			},
		});
	}
}
