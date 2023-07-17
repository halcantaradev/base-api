import { BadRequestException, Injectable } from '@nestjs/common';
import { PersonService } from '../person/person.service';
import { Condominium } from './entities/condominium.entity';
import { PrismaService } from 'src/shared/services/prisma.service';
import { Residence } from './entities/residence.entity';
import { FiltersCondominiumDto } from './dto/filters-condominium.dto';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { FiltersResidenceDto } from './dto/filters-residence.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CondominiumService {
	constructor(
		private readonly pessoaService: PersonService,
		private readonly prisma: PrismaService,
	) {}

	async findAll(
		filters: FiltersCondominiumDto,
		user: UserAuth,
		usuario_id?: number,
	): Promise<Condominium[]> {
		const idUser =
			usuario_id && !Number.isNaN(usuario_id) ? usuario_id : user.id;

		const userData = await this.prisma.user.findFirst({
			include: {
				departamentos: {
					select: {
						departamento_id: true,
					},
				},
			},
			where: {
				id: idUser,
			},
		});

		let listaDepartamentos;

		if (!userData.acessa_todos_departamentos) {
			listaDepartamentos = userData.departamentos.map(
				(departamento) => departamento.departamento_id,
			);
		}

		let departamentos;

		if (
			filters.departamentos?.length &&
			!userData.acessa_todos_departamentos
		) {
			departamentos = filters.departamentos.filter((departamento) =>
				listaDepartamentos.includes(departamento),
			);
		} else if (
			filters.departamentos?.length &&
			userData.acessa_todos_departamentos
		) {
			departamentos = filters.departamentos;
		} else if (!userData.acessa_todos_departamentos) {
			departamentos = listaDepartamentos;
		}

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
			{
				departamentos_condominio: departamentos
					? {
							some: {
								departamento_id: {
									in: departamentos,
								},
								departamento: {
									usuarios: {
										some: {
											usuario_id: idUser,
											acessa_todos_condominios:
												!usuario_id ||
												Number.isNaN(usuario_id)
													? true
													: undefined,
										},
									},
								},
							},
					  }
					: null,
			},
			!usuario_id || Number.isNaN(usuario_id)
				? {
						usuarios_condominio: {
							some: {
								usuario_id: idUser,
							},
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
				OR: filtersSelected.length ? filtersSelected : undefined,
			},
		);
	}

	async findOne(id: number | number[], user: UserAuth): Promise<Condominium> {
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
				condominio_administracao: {
					select: {
						nome: true,
						cargo: { select: { nome: true, sindico: true } },
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

			await this.prisma.usuarioHasCondominios.deleteMany({
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
		body: FiltersResidenceDto,
		user: UserAuth,
	): Promise<Residence[]> {
		if (!body.condominios_ids.length)
			throw new BadRequestException('Selecione um condomínio válido');

		const condominio = await this.findOne(body.condominios_ids, user);

		if (!condominio)
			throw new BadRequestException(
				'Ocorreu um erro ao listar as unidades',
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
				condominio_id: body.condominios_ids?.length
					? {
							in: body.condominios_ids,
					  }
					: undefined,
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
				'Ocorreu um erro ao listar a unidade',
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
