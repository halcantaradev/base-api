import { BadRequestException, Injectable } from '@nestjs/common';
import { PersonService } from '../person/person.service';
import { Condominium } from './entities/condominium.entity';
import { PrismaService } from 'src/shared/services/prisma.service';
import { Residence } from './entities/residence.entity';
import { FiltersCondominiumDto } from './dto/filters-condominium.dto';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { FiltersResidenceDto } from './dto/filters-residence.dto';
import { FiltersCondominiumActiveDto } from './dto/filters-condominium-active.dto';

@Injectable()
export class CondominiumService {
	constructor(
		private readonly pessoaService: PersonService,
		private readonly prisma: PrismaService,
	) {}

	async findAll(
		filters: FiltersCondominiumDto,
		user: UserAuth,
	): Promise<Condominium[]> {
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
				ativo: filters.ativo != null ? filters.ativo : undefined,
				empresa_id: user.empresa_id,
				departamentos_condominio: !user.acessa_todos_departamentos
					? {
							some: {
								departamento_id: {
									in: user.departamentos_ids,
								},
							},
					  }
					: undefined,
				usuarios_condominio: !user.acessa_todos_departamentos
					? {
							some: {
								usuario_id: user.id,
							},
					  }
					: undefined,
				OR: filtersSelected.length ? filtersSelected : undefined,
			},
		);
	}

	async findAllActive(
		filters: FiltersCondominiumActiveDto,
		user: UserAuth,
	): Promise<Condominium[]> {
		let departamentos = null;

		if (filters.departamentos?.length && !user.acessa_todos_departamentos) {
			departamentos = filters.departamentos.filter((departamento) =>
				user.departamentos_ids.includes(departamento),
			);
		} else if (
			filters.departamentos?.length &&
			user.acessa_todos_departamentos
		) {
			departamentos = filters.departamentos;
		} else if (!user.acessa_todos_departamentos) {
			departamentos = user.departamentos_ids;
		}

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
				ativo: true,
				empresa_id: user.empresa_id,
				departamentos_condominio: departamentos
					? {
							some: {
								departamento_id: {
									in: departamentos,
								},
							},
					  }
					: undefined,
				usuarios_condominio: !user.acessa_todos_departamentos
					? {
							some: {
								usuario_id: user.id,
							},
					  }
					: undefined,
			},
		);
	}

	async findOne(id: number, user: UserAuth): Promise<Condominium> {
		return this.pessoaService.findOneById(
			id,
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
				empresa_id: user.empresa_id,
				departamentos_condominio: !user.acessa_todos_departamentos
					? {
							some: {
								departamento_id: {
									in: user.departamentos_ids,
								},
							},
					  }
					: undefined,
				usuarios_condominio: !user.acessa_todos_departamentos
					? {
							some: {
								usuario_id: user.id,
							},
					  }
					: undefined,
			},
		);
	}

	async linkDepartament(
		condominio_id: number,
		departamento_id: number,
		user: UserAuth,
	) {
		let condominio = await this.findOne(condominio_id, user);

		if (!condominio)
			throw new BadRequestException(
				'Ocorreu um erro ao vincular um departamento',
			);

		if (condominio.departamentos_condominio.length) {
			await this.prisma.condominioHasDepartamentos.deleteMany({
				where: {
					condominio_id,
				},
			});
		}

		await this.prisma.condominioHasDepartamentos.create({
			data: {
				condominio_id,
				departamento_id,
			},
		});

		condominio = await this.findOne(condominio_id, user);

		return condominio;
	}

	async findAllResidences(
		id_condominium: number,
		body: FiltersResidenceDto,
		user: UserAuth,
	): Promise<Residence[]> {
		const condominio = await this.findOne(id_condominium, user);

		if (!condominio)
			throw new BadRequestException(
				'Ocorreu um erro ao vincular um departamento',
			);

		return this.prisma.unidade.findMany({
			select: {
				id: true,
				codigo: true,
				condominos: {
					select: {
						condomino: { select: { nome: true, id: true } },
						tipo: { select: { descricao: true } },
					},
					where: {
						condomino: body.busca
							? {
									nome: {
										contains: body.busca
											.toString()
											.normalize('NFD')
											.replace(/[\u0300-\u036f]/g, ''),
										mode: 'insensitive',
									},
							  }
							: undefined,
					},
				},
				ativo: true,
			},
			where: {
				condominio_id: id_condominium,
				ativo: body.ativo != null ? body.ativo : undefined,
				OR: [
					{
						condominos: {
							some: {
								condomino: body.busca
									? {
											nome: {
												contains: body.busca
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
							contains: (body.busca || '')
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
		user: UserAuth,
	): Promise<Residence> {
		const condominio = await this.findOne(id_condominium, user);

		if (!condominio)
			throw new BadRequestException(
				'Ocorreu um erro ao vincular um departamento',
			);

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
