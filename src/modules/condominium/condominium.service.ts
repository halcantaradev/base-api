import { BadRequestException, Injectable } from '@nestjs/common';
import { PersonService } from '../person/person.service';
import { Condominium } from './entities/condominium.entity';
import { PrismaService } from 'src/shared/services/prisma.service';
import { Residence } from './entities/residence.entity';
import { FiltersCondominiumDto } from './dto/filters-condominium.dto';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { FiltersResidenceDto } from './dto/filters-residence.dto';
import { Pagination } from 'src/shared/entities/pagination.entity';
import { UsuariosCondominio } from './entities/usuarios-condominio.entity';

@Injectable()
export class CondominiumService {
	constructor(
		private readonly pessoaService: PersonService,
		private readonly prisma: PrismaService,
	) {}

	async findAll(
		filters: FiltersCondominiumDto,
		user: UserAuth,
		condominiums: number[],
		usuario_id?: number,
		pagination?: Pagination,
	) {
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

		let idsConsultores: number[] | null = null;

		if (
			filters.consultores_ids?.length &&
			!user.acessa_todos_departamentos
		) {
			const consultoresDepartamentos =
				await this.prisma.usuarioHasDepartamentos.findMany({
					where: {
						departamento_id: {
							in: user.departamentos_ids,
						},
						usuario_id: {
							in: [...filters.consultores_ids, user.id],
						},
					},
				});

			idsConsultores = consultoresDepartamentos.map(
				(consultor) => consultor.usuario_id,
			);
		} else if (filters.consultores_ids?.length) {
			idsConsultores = filters.consultores_ids;
		} else if (!user.acessa_todos_departamentos) {
			const consultoresDepartamentos =
				await this.prisma.usuarioHasDepartamentos.findMany({
					where: {
						departamento_id: {
							in: user.departamentos_ids,
						},
						usuario_id: user.id,
					},
				});

			idsConsultores = consultoresDepartamentos.map(
				(consultor) => consultor.usuario_id,
			);
		}

		const fullAccess = !!(await this.prisma.user.findFirst({
			where: {
				id: {
					in: filters.consultores_ids,
				},
				acessa_todos_departamentos: true,
				departamentos: {
					none: {},
				},
			},
		}));

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
						OR: [
							{
								nome: {
									contains: filters.condominio
										.toString()
										.normalize('NFD')
										.replace(/[\u0300-\u036f]/g, ''),
									mode: 'insensitive',
								},
							},
							!Number.isNaN(+filters.condominio)
								? {
										id: +filters.condominio,
								  }
								: null,
						].filter((filtro) => !!filtro),
				  }
				: null,
			filters.endereco
				? {
						OR: [
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
						].filter((filtro) => !!filtro),
				  }
				: null,
			condominiums ||
			userData.acessa_todos_departamentos ||
			filters.departamentos?.length ||
			(usuario_id && !Number.isNaN(usuario_id))
				? {
						OR: [
							{ id: { in: condominiums } },
							userData.acessa_todos_departamentos &&
							!filters.departamentos?.length &&
							!filters.ativo
								? {
										departamentos_condominio: { none: {} },
								  }
								: null,
							userData.acessa_todos_departamentos ||
							(usuario_id && !Number.isNaN(usuario_id))
								? {
										departamentos_condominio: {
											some: {},
										},
								  }
								: null,
						].filter((filter) => !!filter),
				  }
				: null,
			idsConsultores && !fullAccess
				? {
						OR: [
							{
								usuarios_condominio: {
									some: {
										usuario_id: {
											in: idsConsultores,
										},
									},
								},
							},
							{
								departamentos_condominio: {
									some: {
										departamento: {
											usuarios: {
												some: {
													usuario_id: {
														in: idsConsultores,
													},
													restringir_acesso: false,
												},
											},
										},
									},
								},
							},
						],
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
				departamentos_condominio: filters.departamentos?.length
					? {
							some: {
								departamento_id: {
									in: filters.departamentos,
								},
							},
					  }
					: undefined,
				AND: filtersSelected.length ? filtersSelected : undefined,
			},
			pagination,
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
				tipo_contrato: {
					select: {
						id: true,
						nome: true,
						ativo: true,
						created_at: true,
					},
				},
				usuarios_condominio: {
					select: {
						usuario: {
							select: {
								nome: true,
								empresas: {
									select: {
										cargo: {
											select: {
												id: true,
												nome: true,
											},
										},
									},
								},
							},
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

	async findResponsible(
		id: number,
		user: UserAuth,
	): Promise<UsuariosCondominio[]> {
		return this.prisma.user.findMany({
			select: {
				id: true,
				nome: true,
				empresas: {
					select: {
						cargo: {
							select: {
								id: true,
								nome: true,
							},
						},
					},
				},
				telefone: true,
				whatsapp: true,
				email: true,
				ramal: true,
			},
			where: {
				acessa_todos_departamentos: false,
				OR: [
					{
						condominios: {
							some: {
								condominio_id: id,
								condominio: {
									empresa_id: user.empresa_id,
									departamentos_condominio:
										!user.acessa_todos_departamentos
											? {
													some: {
														departamento_id: {
															in: user.departamentos_ids,
														},
													},
											  }
											: undefined,
									usuarios_condominio:
										!user.acessa_todos_departamentos
											? {
													some: {
														usuario_id: user.id,
													},
											  }
											: undefined,
								},
							},
						},
					},
					{
						departamentos: {
							some: {
								departamento: {
									condominios: {
										some: {
											condominio_id: id,
										},
									},
								},
							},
						},
					},
				],
			},
		});
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

	async linkContract(
		condominio_id: number,
		tipo_contrato_id: number,
		user: UserAuth,
	) {
		const condominio = await this.findOne(condominio_id, user);

		if (!condominio)
			throw new BadRequestException(
				'Ocorreu um erro ao vincular o contrato',
			);

		await this.prisma.pessoa.update({
			data: {
				tipo_contrato_id,
			},
			where: {
				id: condominio_id,
			},
		});

		return;
	}

	async findAllResidences(
		body: FiltersResidenceDto,
		user: UserAuth,
		pagination?: Pagination,
	) {
		if (!body.condominios_ids.length)
			throw new BadRequestException('Selecione um condomínio válido');

		const condominio = await this.findOne(body.condominios_ids, user);

		if (!condominio)
			throw new BadRequestException(
				'Ocorreu um erro ao listar as unidades',
			);

		const unidades = await this.prisma.unidade.findMany({
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
			take: pagination?.page ? 20 : 100,
			skip: pagination?.page ? (pagination?.page - 1) * 20 : undefined,
		});

		const total_pages = Math.ceil(
			(await this.prisma.unidade.count({
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
			})) / (pagination?.page ? 20 : 100),
		);

		return {
			data: unidades,
			total_pages,
		};
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

	findOnById(id: number) {
		return this.pessoaService.findOneById(id, 'condominio');
	}
}
