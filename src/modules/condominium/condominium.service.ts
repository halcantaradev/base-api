import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Pagination } from 'src/shared/entities/pagination.entity';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { PersonService } from '../person/person.service';
import { FiltersCondominiumDto } from './dto/filters-condominium.dto';
import { FiltersResidenceDto } from './dto/filters-residence.dto';
import { ReportCondominiumDto } from './dto/report-condominium.dto';
import { Condominium } from './entities/condominium.entity';
import { Residence } from './entities/residence.entity';
import { UsuariosCondominio } from './entities/usuarios-condominio.entity';
import { ReportTypeCondominium } from './enum/report-type-condominium.enum';
import { CreateCondominiumDto } from './dto/create-condominium.dto';
import { UpdateCondominiumDto } from './dto/update-condominium.dto';
import { File } from 'src/shared/entities/file.entity';
import { FilesOrigin } from 'src/shared/consts/file-origin.const';
import { FilterCondominiumDocumentDto } from './dto/filter-condominium-document.dto';
import { setCustomHour } from 'src/shared/helpers/date.helper';

@Injectable()
export class CondominiumService {
	constructor(
		private readonly pessoaService: PersonService,
		private readonly prisma: PrismaService,
	) {}

	async create(
		empresa_id: number,
		createCondominiumDto: CreateCondominiumDto,
	) {
		if (
			createCondominiumDto.cnpj !== null &&
			createCondominiumDto.cnpj !== undefined
		) {
			const cnpjAlreadyExists = await this.prisma.pessoa.findFirst({
				where: {
					cnpj: createCondominiumDto.cnpj,
				},
			});
			if (cnpjAlreadyExists) {
				throw new BadRequestException(
					'O CNPJ do condomínio já existe, por favor verifique os dados',
				);
			}
		}

		const nomeAlreadyExists = await this.prisma.pessoa.findFirst({
			where: {
				nome: createCondominiumDto.nome,
			},
		});

		if (nomeAlreadyExists) {
			throw new BadRequestException(
				'O nome do condomínio já existe, por favor verifique os dados',
			);
		}
		let departamento;
		if (createCondominiumDto.departamento_id) {
			departamento = await this.prisma.departamento.findFirst({
				where: {
					id: createCondominiumDto.departamento_id,
					empresa_id,
				},
			});
		}

		const condominioId = await this.prisma.tiposPessoa.findFirst({
			where: {
				nome: 'condominio',
			},
		});

		let tipos_contratos;
		if (createCondominiumDto.tipos_contratos_ids) {
			tipos_contratos = await this.prisma.tipoContratoCondominio.findMany(
				{
					where: {
						id: { in: createCondominiumDto.tipos_contratos_ids },
					},
				},
			);
		}

		return this.prisma.pessoa.create({
			data: {
				empresa_id,
				nome: createCondominiumDto.nome,
				cnpj: createCondominiumDto.cnpj,
				cep: createCondominiumDto.cep,
				endereco: createCondominiumDto.endereco,
				bairro: createCondominiumDto.bairro,
				cidade: createCondominiumDto.cidade,
				uf: createCondominiumDto.uf,
				numero: createCondominiumDto.numero,
				categoria_id: createCondominiumDto.categoria_id,
				importado: createCondominiumDto.importado,
				tipos: condominioId.id
					? {
							create: [
								{
									tipo_id: condominioId.id,
								},
							],
					  }
					: undefined,
				departamentos_condominio: departamento
					? {
							create: [{ departamento_id: departamento.id }],
					  }
					: undefined,
				condominios_tipos_contratos: tipos_contratos
					? {
							createMany: {
								data: tipos_contratos.map((contrato) => ({
									tipo_contrato_id: contrato.id,
								})),
							},
					  }
					: undefined,
			},
		});
	}

	async update(empresa_id: number, id: number, body: UpdateCondominiumDto) {
		if (Number.isNaN(id)) {
			throw new BadRequestException('Condomínio não encontrado');
		}
		const condominioExists = await this.prisma.pessoa.findFirst({
			where: {
				id,
				empresa_id,
				importado: false,
			},
		});

		if (!condominioExists) {
			throw new BadRequestException(
				'Condomínio não encontrado ou não pode ser editado!',
			);
		}

		const nomeAlreadyExists = await this.prisma.pessoa.findFirst({
			where: {
				nome: body.nome,
				id: {
					not: id,
				},
			},
		});

		if (nomeAlreadyExists) {
			throw new BadRequestException(
				'Este nome de condomínio não pode ser utilizado, por favor verifique suas informações',
			);
		}
		let deparmentExists;
		if (body.departamento_id) {
			deparmentExists = await this.prisma.departamento.findFirst({
				where: {
					id: body.departamento_id,
					empresa_id,
				},
			});

			if (!deparmentExists) {
				throw new BadRequestException(
					'Departamento não encontrado, por favor escolha um departamento valido',
				);
			}
		}

		let contractsExists;
		if (body.tipos_contratos_ids.length) {
			contractsExists = await this.prisma.tipoContratoCondominio.findMany(
				{
					where: {
						id: { in: body.tipos_contratos_ids },
					},
				},
			);
			if (!contractsExists.length) {
				throw new BadRequestException(
					'Tipo de contrato não encontrado, por favor escolha um tipo de contrato valido',
				);
			}
		}

		return this.prisma.pessoa.update({
			data: {
				nome: body.nome,
				ativo: body.ativo,
				cnpj: body.cnpj,
				cep: body.cep,
				endereco: body.endereco,
				bairro: body.bairro,
				cidade: body.cidade,
				uf: body.uf,
				numero: body.numero,
				categoria_id: body.categoria_id,
				departamentos_condominio: {
					deleteMany: { condominio_id: id },
					create: deparmentExists?.id
						? {
								departamento_id: deparmentExists.id,
						  }
						: undefined,
				},
				condominios_tipos_contratos: {
					deleteMany: {
						condominio_id: id,
					},
					createMany: contractsExists?.length
						? {
								data: contractsExists.map((contrato) => ({
									tipo_contrato_id: contrato.id,
								})),
						  }
						: undefined,
				},
			},
			where: {
				id,
			},
		});
	}

	private async getFilterList(
		filters: FiltersCondominiumDto,
		user: UserAuth,
		condominiums: number[],
		usuario_id?: number,
		ativo = false,
		todos = false,
	): Promise<Prisma.PessoaWhereInput> {
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

		const filtersSelected: Prisma.PessoaWhereInput[] = [
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

			filters.importado !== null
				? {
						importado: filters.importado,
				  }
				: undefined,
			filters.condominio
				? {
						OR: [
							{
								nome: {
									contains: filters.condominio
										.toString()
										.normalize('NFC')
										.replace(/[\u0300-\u036f]/g, ''),
									mode: Prisma.QueryMode.insensitive,
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
											mode: Prisma.QueryMode.insensitive,
										},
								  }
								: null,
							filters.endereco
								? {
										endereco: {
											contains: filters.endereco,
											mode: Prisma.QueryMode.insensitive,
										},
								  }
								: null,
							filters.endereco
								? {
										cidade: {
											contains: filters.endereco,
											mode: Prisma.QueryMode.insensitive,
										},
								  }
								: null,
							filters.endereco
								? {
										uf: {
											contains: filters.endereco,
											mode: Prisma.QueryMode.insensitive,
										},
								  }
								: null,
							filters.endereco
								? {
										cep: {
											contains: filters.endereco,
											mode: Prisma.QueryMode.insensitive,
										},
								  }
								: null,
						].filter((filtro) => !!filtro),
				  }
				: null,
			filters.departamentos_ids?.length || filters.filiais_ids?.length
				? {
						departamentos_condominio: {
							some: {
								departamento_id: filters.departamentos_ids
									?.length
									? {
											in: filters.departamentos_ids,
									  }
									: undefined,
								departamento: filters.filiais_ids?.length
									? {
											filial_id: {
												in: filters.filiais_ids,
											},
									  }
									: undefined,
							},
						},
				  }
				: null,
			filters.tipos_contrato_ids?.length
				? {
						tipo_contrato_id: {
							in: filters.tipos_contrato_ids,
						},
				  }
				: null,
			filters.ativo != null ? { ativo: filters.ativo } : null,
			condominiums ||
			userData.acessa_todos_departamentos ||
			filters.departamentos_ids?.length ||
			(usuario_id && !Number.isNaN(usuario_id))
				? {
						OR: [
							{ id: { in: condominiums } },
							userData.acessa_todos_departamentos &&
							!filters.departamentos_ids?.length &&
							!ativo
								? {
										departamentos_condominio: {
											none: {},
										},
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
													delimitar_acesso: false,
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

		const filtersSelectedAll: Prisma.PessoaWhereInput[] = [
			filters.condominio
				? {
						OR: [
							{
								nome: {
									contains: filters.condominio
										.toString()
										.normalize('NFC')
										.replace(/[\u0300-\u036f]/g, ''),
									mode: Prisma.QueryMode.insensitive,
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
		];
		return {
			empresa_id: user.empresa_id,
			AND: todos
				? filtersSelectedAll.length
					? filtersSelectedAll
					: undefined
				: filtersSelected.length
				? filtersSelected
				: undefined,
		};
	}

	async findAll(
		filters: FiltersCondominiumDto,
		user: UserAuth,
		condominiums: number[],
		usuario_id?: number,
		pagination?: Pagination,
		ativo = false,
		todos = false,
	) {
		return this.pessoaService.findAll(
			'condominio',
			{
				departamentos_condominio: {
					select: {
						departamento_id: true,
						departamento: {
							select: {
								id: true,
								nome: true,
								nac: true,
								ativo: true,
								filial: {
									select: {
										id: true,
										nome: true,
									},
								},
							},
						},
					},
					where: {
						departamento: {
							condominios: {
								some: {
									condominio: {
										empresa_id: user.empresa_id,
									},
								},
							},
						},
					},
				},
				condominios_tipos_contratos: {
					select: {
						tipo_contrato: {
							select: {
								id: true,
								nome: true,
								ativo: true,
							},
						},
					},
				},
			},
			await this.getFilterList(
				filters,
				user,
				condominiums,
				usuario_id,
				ativo,
				todos,
			),
			pagination,
		);
	}

	async report(
		report: ReportCondominiumDto,
		user: UserAuth,
		condominiums: number[],
	) {
		let condominiumsSaved: any[] = (
			await this.pessoaService.findAll(
				'condominio',
				{
					condominios_tipos_contratos: {
						select: {
							tipo_contrato: {
								select: {
									id: true,
									nome: true,
									ativo: true,
								},
							},
						},
					},
					departamentos_condominio: {
						select: {
							departamento_id: true,
							departamento: {
								select: {
									nome: true,
									filial_id: true,
									filial: {
										select: {
											nome: true,
										},
									},
								},
							},
						},
						where: {
							departamento: {
								empresa_id: user.empresa_id,
							},
						},
					},
				},
				await this.getFilterList(report.filtros, user, condominiums),
				null,
			)
		).data;

		condominiumsSaved = await Promise.all(
			condominiumsSaved.map(async (condominium) => ({
				...condominium,
				responsaveis: (
					await this.findResponsible(condominium.id, user)
				).filter(
					(responsavel) =>
						report.filtros.consultores_ids == null ||
						!report.filtros.consultores_ids.length ||
						report.filtros.consultores_ids.includes(responsavel.id),
				),
			})),
		);
		let total = 0;
		let response;
		if (report.tipo === ReportTypeCondominium.GERAL) {
			response = {
				data: condominiumsSaved,
				total: condominiumsSaved.length,
			};
		} else {
			const data = condominiumsSaved.reduce(
				(list: Array<any>, currentValue) => {
					let grupos: { id: number; descricao: string }[] = [];

					switch (report.tipo) {
						case ReportTypeCondominium.FILIAL:
							grupos = currentValue.departamentos_condominio.map(
								(item) => ({
									id: item.departamento.filial_id,
									descricao: item.departamento.filial.nome,
								}),
							);
							total = condominiumsSaved.filter(
								(item) =>
									item.departamentos_condominio.length > 0,
							).length;
							break;

						case ReportTypeCondominium.DEPARTAMENTO:
							grupos = currentValue.departamentos_condominio.map(
								(item) => ({
									id: item.departamento_id,
									descricao: `${item.departamento.nome} (${item.departamento.filial.nome})`,
								}),
							);
							total = condominiumsSaved.filter(
								(item) =>
									item.departamentos_condominio.length > 0,
							).length;
							break;

						case ReportTypeCondominium.RESPONSAVEL:
							grupos = currentValue.responsaveis.map((item) => ({
								id: item.id,
								descricao: `${item.nome} (${item.empresas[0].cargo.nome})`,
							}));
							total = condominiumsSaved.filter(
								(item) => item.responsaveis.length > 0,
							).length;
							break;

						default:
							break;
					}

					if (!grupos.length) return list;

					grupos.forEach((grupo) => {
						let index = list.findIndex(
							(item) => item.id == grupo.id,
						);

						if (index === -1) {
							list.push({
								...grupo,
								data: [],
							});

							index = list.length - 1;
						}

						list[index].data.push(currentValue);
					});

					return list;
				},
				[],
			);

			return { data, total };
		}

		return response;
	}

	async findOne(id: number | number[], user: UserAuth): Promise<Condominium> {
		return this.pessoaService.findOneById(
			id,
			'condominio',
			{
				importado: true,
				categoria_id: true,
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
				condominios_tipos_contratos: {
					select: {
						tipo_contrato: {
							select: {
								id: true,
								nome: true,
								ativo: true,
							},
						},
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
					where: {
						empresa_id: user.empresa_id,
					},
				},
				departamentos: {
					select: {
						departamento: {
							select: {
								id: true,
								nome: true,
								nac: true,
								ativo: true,
								filial: {
									select: {
										id: true,
										nome: true,
									},
								},
							},
						},
					},
					where: {
						departamento: {
							condominios: {
								some: {
									condominio_id: id,
								},
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
						condominios: {
							none: {},
						},
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

	async findDocuments(
		id: number,
		filterCondominiumDocumentDto: FilterCondominiumDocumentDto,
		user: UserAuth,
		pagination?: Pagination,
	): Promise<File[]> {
		const condominio = await this.findOne(id, user);

		if (!condominio)
			throw new BadRequestException(
				'Ocorreu um erro ao listar os arquivos do condomínio',
			);

		return this.prisma.arquivo.findMany({
			where: {
				origem: FilesOrigin.CONDOMINIUM,
				referencia_id: id,
				ativo: true,
				created_at: filterCondominiumDocumentDto.data_envio
					? {
							gte:
								setCustomHour(
									filterCondominiumDocumentDto.data_envio[0],
								) || undefined,
							lte:
								setCustomHour(
									filterCondominiumDocumentDto.data_envio[1],
									23,
									59,
									59,
								) || undefined,
					  }
					: undefined,
				OR: filterCondominiumDocumentDto.busca
					? [
							{
								id: !Number.isNaN(
									+filterCondominiumDocumentDto.busca,
								)
									? +filterCondominiumDocumentDto.busca
									: undefined,
							},
							{
								nome: {
									contains:
										filterCondominiumDocumentDto.busca,
									mode: 'insensitive',
								},
							},
							{
								descricao: {
									contains:
										filterCondominiumDocumentDto.busca,
									mode: 'insensitive',
								},
							},
					  ]
					: undefined,
			},
			take: pagination?.page ? 20 : 100,
			skip: pagination?.page ? (pagination?.page - 1) * 20 : undefined,
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
		tipos_contratos_ids: number[],
		user: UserAuth,
	) {
		const condominio = await this.findOne(condominio_id, user);

		if (!condominio)
			throw new BadRequestException(
				'Ocorreu um erro ao vincular o contrato',
			);

		await this.prisma.condominiosHasTiposContrato.deleteMany({
			where: {
				condominio_id,
			},
		});

		await this.prisma.condominiosHasTiposContrato.createMany({
			data: tipos_contratos_ids.map((id) => ({
				tipo_contrato_id: id,
				condominio_id,
			})),
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
				created_at: true,
				condominos: {
					select: {
						condomino: { select: { nome: true, id: true } },
						tipo: { select: { descricao: true } },
					},
					where: {
						OR: [
							{
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
									: undefined,
							},
							{
								unidade: {
									codigo: {
										contains: (body.busca || '')
											.toString()
											.normalize('NFD')
											.replace(/[\u0300-\u036f]/g, ''),
										mode: 'insensitive',
									},
								},
							},
						],
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

		const total_pages = await this.prisma.unidade.count({
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
				condominio: {
					select: {
						nome: true,
					},
				},
				condominos: {
					select: {
						condomino: {
							select: {
								nome: true,
								endereco: true,
								cidade: true,
								bairro: true,
							},
						},
						tipo: { select: { descricao: true } },
					},
				},
				created_at: true,
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
