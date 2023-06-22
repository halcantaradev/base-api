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
		const filtersSelected: Array<any> = [
			filters.categoria_id && !Number.isNaN(+filters.categoria_id)
				? {
						categoria_id: +filters.categoria_id,
				  }
				: null,
			filters.data_inicio || filters.data_fim
				? {
						created_at: {
							lte: filters.data_fim || undefined,
							gte: filters.data_inicio || undefined,
						},
				  }
				: null,
			filters.condominio
				? {
						nome: {
							contains: filters.condominio,
							mode: 'insensitive',
						},
				  }
				: null,
			filters.condominio && !Number.isNaN(+filters.condominio)
				? {
						id: +filters.condominio,
				  }
				: null,
			filters.endereco
				? {
						bairro: {
							contains: filters.endereco,
							mode: 'insensitive',
						},
				  }
				: null,
			filters.endereco
				? {
						endereco: {
							contains: filters.endereco,
							mode: 'insensitive',
						},
				  }
				: null,
			filters.endereco
				? {
						cidade: {
							contains: filters.endereco,
							mode: 'insensitive',
						},
				  }
				: null,
			filters.endereco
				? {
						uf: {
							contains: filters.endereco,
							mode: 'insensitive',
						},
				  }
				: null,
			filters.endereco
				? {
						cep: {
							contains: filters.endereco,
							mode: 'insensitive',
						},
				  }
				: null,
		].filter((filter) => !!filter);

		return this.pessoaService.findAll(
			'condominio',
			{},
			{
				OR: filtersSelected.length ? filtersSelected : undefined,
			},
		);
	}

	async findOne(id: number): Promise<Condominium> {
		return this.pessoaService.findOneById(id, 'condominio');
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
