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
							contains: filters.condominio
								.toString()
								.normalize('NFD')
								.replace(/[\u0300-\u036f]/g, ''),
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
			{
				departamentos_condominio: {
					select: {
						departamento_id: true,
						departamento: {
							select: { nome: true },
						},
					},
				},
			},
			{
				OR: filtersSelected.length ? filtersSelected : undefined,
			},
		);
	}

	async findOne(id: number): Promise<Condominium> {
		return this.pessoaService.findOneById(id, 'condominio', {
			departamentos_condominio: {
				select: {
					departamento_id: true,
					departamento: {
						select: { nome: true },
					},
				},
			},
		});
	}

	async linkDepartament(condominio_id: number, departamento_id: number) {
		const vinculo = await this.prisma.condominioHasDepartamentos.findMany({
			where: { condominio_id },
		});

		if (vinculo.length) {
			await this.prisma.condominioHasDepartamentos.updateMany({
				data: {
					departamento_id,
				},
				where: {
					condominio_id,
				},
			});
		} else {
			await this.prisma.condominioHasDepartamentos.create({
				data: {
					condominio_id,
					departamento_id,
				},
			});
		}

		return this.findOne(condominio_id);
	}

	async findAllResidences(
		id_condominium: number,
		busca?: string,
	): Promise<Residence[]> {
		return this.prisma.unidade.findMany({
			select: {
				id: true,
				codigo: true,
				condominos: {
					select: {
						condomino: { select: { nome: true, id: true } },
						tipo: { select: { descricao: true } },
					},
				},
				ativo: true,
			},
			where: {
				condominio_id: id_condominium,
				OR: [
					{
						condominos: {
							some: {
								condomino: busca
									? {
											nome: {
												contains: busca
													.toString()
													.normalize('NFD')
													.replace(
														/[\u0300-\u036f]/g,
														'',
													),
												mode: 'insensitive',
											},
									  }
									: {},
							},
						},
					},
					{
						codigo: {
							contains: (busca || '')
								.toString()
								.normalize('NFD')
								.replace(/[\u0300-\u036f]/g, ''),
							mode: 'insensitive',
						},
					},
				],
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
				condominos: {
					select: {
						condomino: { select: { nome: true } },
						tipo: { select: { descricao: true } },
					},
				},
				ativo: true,
			},
			where: {
				condominio_id: id_condominium,
				id: id,
			},
		});
	}
}
