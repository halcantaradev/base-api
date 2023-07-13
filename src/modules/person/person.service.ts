import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class PersonService {
	constructor(private readonly prisma: PrismaService) {}

	async findAll(
		tipo: string,
		select: Prisma.PessoaSelect = {},
		where: Prisma.PessoaWhereInput = {},
	): Promise<any[]> {
		return this.prisma.pessoa.findMany({
			select: {
				id: true,
				nome: true,
				cnpj: true,
				numero: true,
				endereco: true,
				cep: true,
				bairro: true,
				cidade: true,
				uf: true,
				ativo: true,
				contatos: {
					select: {
						contato: true,
						tipo: true,
						descricao: true,
					},
				},
				...select,
			},
			where: {
				...where,
				tipos: { some: { tipo: { nome: tipo } } },
			},
		});
	}

	async findOneById(
		id: number | number[],
		tipo: string,
		select: Prisma.PessoaSelect = {},
		where: Prisma.PessoaWhereInput = {},
	): Promise<any> {
		return this.prisma.pessoa.findFirst({
			select: {
				id: true,
				nome: true,
				cnpj: true,
				numero: true,
				endereco: true,
				cep: true,
				bairro: true,
				cidade: true,
				uf: true,
				ativo: true,
				contatos: {
					select: {
						contato: true,
						tipo: true,
						descricao: true,
					},
				},
				...select,
			},
			where: {
				...where,
				id: Array.isArray(id) ? { in: id } : id,
				tipos: { some: { tipo: { nome: tipo } } },
			},
		});
	}
}
