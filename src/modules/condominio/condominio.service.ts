import { Injectable } from '@nestjs/common';
import { PessoaService } from '../pessoa/pessoa.service';
import { Condominio } from './entities/condominio.entity';
import { PrismaService } from 'src/shared/services/prisma.service';
import { Unidade } from './entities/unidade.entity';
import { FiltersDto } from './dto/filters.dto';

@Injectable()
export class CondominioService {
	constructor(
		private readonly pessoaService: PessoaService,
		private readonly prisma: PrismaService,
	) {}

	async findAll(filters: FiltersDto): Promise<Condominio[]> {
		return this.pessoaService.findAll(
			'condominio',
			{
				id: true,
				nome: true,
				cnpj: true,
				endereco: true,
				cep: true,
				bairro: true,
				cidade: true,
				uf: true,
				ativa: true,
				contato: {
					select: {
						contato: true,
					},
				},
			},
			{
				nome: {
					contains: filters.condominio,
					mode: 'insensitive',
				},
				id: +filters.condominio || undefined,
				// consultor_id: {
				// 	contains: +filters.consultor_id,
				// 	mode: 'insensitive',
				// },
				categoria_id: +filters.tipo_id || undefined,
				created_at: {
					lte: filters.data_fim || undefined,
					gte: filters.data_inicio || undefined,
				},
				OR: [
					{
						bairro: {
							contains: filters.endereco,
							mode: 'insensitive',
						},
					},
					{
						endereco: {
							contains: filters.endereco,
							mode: 'insensitive',
						},
					},
					{
						cidade: {
							contains: filters.endereco,
							mode: 'insensitive',
						},
					},
					{
						uf: {
							contains: filters.endereco,
							mode: 'insensitive',
						},
					},
					{
						cep: {
							contains: filters.endereco,
							mode: 'insensitive',
						},
					},
				],
			},
		);
	}

	async findOne(id: number): Promise<Condominio> {
		return this.pessoaService.findOneById(id, 'condominio', {
			id: true,
			nome: true,
			cnpj: true,
			endereco: true,
			cep: true,
			bairro: true,
			cidade: true,
			uf: true,
			ativa: true,
			contato: {
				select: {
					contato: true,
				},
			},
		});
	}

	async findAllUnidades(idCondominio: number): Promise<Unidade[]> {
		return this.prisma.unidade.findMany({
			select: {
				id: true,
				codigo: true,
				ativo: true,
			},
			where: {
				condominio_id: idCondominio,
			},
		});
	}

	async findOneUnidade(idCondominio: number, id: number): Promise<Unidade> {
		return this.prisma.unidade.findFirst({
			select: {
				id: true,
				codigo: true,
				ativo: true,
			},
			where: {
				condominio_id: idCondominio,
				id: id,
			},
		});
	}
}
