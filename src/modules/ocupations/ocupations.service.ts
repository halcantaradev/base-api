import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { CreateOcupationDto } from './dto/create-ocupation.dto';
import { UpdateOcupationDto } from './dto/update-ocupation.dto';

@Injectable()
export class OcupationsService {
	constructor(private readonly prisma: PrismaService) {}

	create(createOcupationDto: CreateOcupationDto) {
		return this.prisma.cargo.create({
			data: {
				nome: createOcupationDto.nome,
				perfil: createOcupationDto.perfil,
				ativo:
					createOcupationDto.ativo != null
						? createOcupationDto.ativo
						: true,
			},
		});
	}

	findAll(busca?: string, ativo?: boolean) {
		return this.prisma.cargo.findMany({
			where: {
				nome: busca
					? {
							contains: busca,
							mode: 'insensitive',
					  }
					: undefined,
				ativo: ativo != null ? ativo : undefined,
			},
			orderBy: {
				nome: 'asc',
			},
		});
	}

	async update(id: number, updateOcupationDto: UpdateOcupationDto) {
		const cargo = await this.prisma.cargo.findFirst({
			where: {
				id,
			},
		});

		if (Number.isNaN(id) || !cargo)
			throw new BadRequestException('Cargo não encontrado');

		return this.prisma.cargo.update({
			data: {
				nome:
					updateOcupationDto.nome != null
						? updateOcupationDto.nome
						: undefined,
				ativo:
					updateOcupationDto.ativo != null
						? updateOcupationDto.ativo
						: true,
			},
			where: {
				id,
			},
		});
	}
}
