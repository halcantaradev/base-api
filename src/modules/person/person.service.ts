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
				endereco: true,
				cep: true,
				bairro: true,
				cidade: true,
				uf: true,
				ativa: true,
				contatos: {
					select: {
						contato: true,
						tipo_registro: true,
						descricao: true,
					},
				},
				...select,
			},
			where: {
				...where,
				pessoas_has_tipos: { some: { tipo: { nome: tipo } } },
			},
		});
	}

	async findOneById(
		id: number,
		tipo: string,
		select: Prisma.PessoaSelect = {},
		where: Prisma.PessoaWhereInput = {},
	): Promise<any> {
		return this.prisma.pessoa.findFirst({
			select: {
				id: true,
				nome: true,
				cnpj: true,
				endereco: true,
				cep: true,
				bairro: true,
				cidade: true,
				uf: true,
				ativa: true,
				contatos: {
					select: {
						contato: true,
						tipo_registro: true,
						descricao: true,
					},
				},
				...select,
			},
			where: {
				...where,
				id,
				pessoas_has_tipos: { some: { tipo: { nome: tipo } } },
			},
		});
	}
}
