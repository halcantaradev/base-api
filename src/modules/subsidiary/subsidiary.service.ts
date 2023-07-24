import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubsidiaryDto } from './dto/create-subsidiary.dto';
import { UpdateSubsidiaryDto } from './dto/update-subsidiary.dto';
import { PrismaService } from 'src/shared/services/prisma.service';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubsidiaryService {
	constructor(private readonly prisma: PrismaService) {}

	select: Prisma.FiliaisSelect = {
		id: true,
		nome: true,
		ativo: true,
	};

	create(user: UserAuth, createSubsidiaryDto: CreateSubsidiaryDto) {
		return this.prisma.filiais.create({
			select: this.select,
			data: {
				nome: createSubsidiaryDto.nome,
				ativo:
					createSubsidiaryDto.ativo != null
						? createSubsidiaryDto.ativo
						: true,
				empresa_id: user.empresa_id,
			},
		});
	}

	findAll(user: UserAuth) {
		return this.prisma.filiais.findMany({
			select: this.select,
			where: {
				empresa_id: user.empresa_id,
			},
		});
	}

	findOne(id: number, user: UserAuth) {
		return this.prisma.filiais.findFirst({
			select: this.select,
			where: {
				id,
				empresa_id: user.empresa_id,
			},
		});
	}

	async update(
		id: number,
		user: UserAuth,
		updateSubsidiaryDto: UpdateSubsidiaryDto,
	) {
		const filial = await this.findOne(id, user);

		if (!filial)
			throw new BadRequestException('Departamento não encontrado');

		return this.prisma.filiais.update({
			select: this.select,
			data: {
				nome: updateSubsidiaryDto.nome,
				ativo:
					updateSubsidiaryDto.ativo != null
						? updateSubsidiaryDto.ativo
						: true,
				empresa_id: user.empresa_id,
			},
			where: {
				id,
			},
		});
	}
}
