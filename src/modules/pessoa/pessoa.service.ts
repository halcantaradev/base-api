import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class PessoaService {
	constructor(private readonly prisma: PrismaService) {}

	async findAll(
		tipo: string,
		select: Prisma.PessoaSelect,
		where: Prisma.PessoaWhereInput = {},
	): Promise<any[]> {
		return this.prisma.pessoa.findMany({
			select,
			where: {
				...where,
				pessoas_has_tipos: { some: { tipo: { nome: tipo } } },
			},
		});
	}

	async findOneById(
		id: number,
		tipo: string,
		select: Prisma.PessoaSelect,
		where: Prisma.PessoaWhereInput = {},
	): Promise<any> {
		return this.prisma.pessoa.findFirst({
			select,
			where: {
				...where,
				id,
				pessoas_has_tipos: { some: { tipo: { nome: tipo } } },
			},
		});
	}
}
