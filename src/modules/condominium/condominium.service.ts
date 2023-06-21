import { Injectable } from '@nestjs/common';
import { PersonService } from '../person/person.service';
import { Condominium } from './entities/condominium.entity';
import { PrismaService } from 'src/shared/services/prisma.service';
import { Residence } from './entities/residence.entity';
import { FiltersCondominiumDto } from './dto/filters.dto';

@Injectable()
export class CondominiumService {
	constructor(
		private readonly pessoaService: PersonService,
		private readonly prisma: PrismaService,
	) {}

	async findAll(filters: FiltersCondominiumDto): Promise<Condominium[]> {
		const filtros = [
			filters.tipo_id && { categoria_id: +filters.tipo_id },
			(filters.data_inicio || filters.data_fim) && {
				created_at: {
					lte: filters.data_fim,
					gte: filters.data_inicio,
				},
			},
			filters.condominio && {
				nome: {
					contains: filters.condominio,
					mode: 'insensitive',
				},
			},
			filters.condominio && {
				id: +filters.condominio,
			},
			filters.endereco && {
				bairro: {
					contains: filters.endereco,
					mode: 'insensitive',
				},
			},
			filters.endereco && {
				endereco: {
					contains: filters.endereco,
					mode: 'insensitive',
				},
			},
			filters.endereco && {
				cidade: {
					contains: filters.endereco,
					mode: 'insensitive',
				},
			},
			filters.endereco && {
				uf: {
					contains: filters.endereco,
					mode: 'insensitive',
				},
			},
			filters.endereco && {
				cep: {
					contains: filters.endereco,
					mode: 'insensitive',
				},
			},
		].filter((filter) => !!filter);

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
				OR: [].concat(filtros),
			},
		);
	}

	async findOne(id: number): Promise<Condominium> {
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

	async findAllResidences(id_condominium: number): Promise<Residence[]> {
		return this.prisma.unidade.findMany({
			select: {
				id: true,
				codigo: true,
				ativo: true,
			},
			where: {
				condominio_id: id_condominium,
			},
		});
	}

	async findOneResidence(
		id_condominium: number,
		id: number,
	): Promise<Residence> {
		return this.prisma.unidade.findFirst({
			select: {
				id: true,
				codigo: true,
				ativo: true,
			},
			where: {
				condominio_id: id_condominium,
				id: id,
			},
		});
	}
}
