import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordHelper } from 'src/shared/helpers/password.helper';
import { ReturnUserEntity } from './entities/return-user.entity';
import { ReturnUserListEntity } from './entities/return-user-list.entity';
import { ListUserDto } from './dto/list-user.dto';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { LinkCondominiumsDto } from './dto/link-condominiums.dto';
import { FilterUserCondominiumDto } from './dto/filter-user-condominium.dto';
import { PersonService } from '../person/person.service';
import { Prisma } from '@prisma/client';
import { ReportUserDto } from './dto/report-user.dto';
import { log } from 'console';

@Injectable()
export class UserService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly pessoaService: PersonService,
	) {}

	private async getFilterList(
		user: UserAuth,
		filtros: ListUserDto = {},
		condominiums?: number[],
	): Promise<Prisma.UserWhereInput> {
		return {
			OR: filtros.busca
				? [
						{
							id: !Number.isNaN(+filtros.busca)
								? +filtros.busca
								: undefined,
						},
						{
							nome: {
								contains: filtros.busca,
								mode: 'insensitive',
							},
						},
						{
							email: {
								contains: filtros.busca,
								mode: 'insensitive',
							},
						},
				  ]
				: undefined,
			acessa_todos_departamentos:
				filtros.departamentos && filtros.departamentos.length
					? false
					: undefined,
			empresas: {
				some: {
					empresa_id: user.empresa_id,
					cargo_id:
						filtros.cargos && filtros.cargos.length
							? {
									in: filtros.cargos,
							  }
							: undefined,
				},
			},
			departamentos:
				filtros.departamentos && filtros.departamentos.length
					? {
							some: {
								departamento_id: {
									in: filtros.departamentos,
								},
							},
					  }
					: undefined,
			condominios:
				condominiums != null && !user.acessa_todos_departamentos
					? {
							some: {
								condominio_id: { in: condominiums },
							},
					  }
					: undefined,
		};
	}

	async create(createUserDto: CreateUserDto, user: UserAuth) {
		await this.prisma.user.create({
			data: {
				nome: createUserDto.nome,
				username: createUserDto.username,
				password: PasswordHelper.create(createUserDto.password),
				email: createUserDto.email,
				telefone: createUserDto.telefone,
				ramal: createUserDto.ramal,
				whatsapp: createUserDto.whatsapp,
				acessa_todos_departamentos:
					createUserDto.acessa_todos_departamentos,
				empresas: {
					create: {
						cargo_id: createUserDto.cargo_id,
						empresa_id: user.empresa_id,
					},
				},
				departamentos: createUserDto.departamentos
					? {
							createMany: {
								data: createUserDto.departamentos.map(
									(departamento) => ({
										departamento_id: departamento,
									}),
								),
							},
					  }
					: undefined,
			},
		});

		return { success: true, message: 'Usuário criado com sucesso.' };
	}

	async findAll(
		user: UserAuth,
		filtros: ListUserDto = {},
		condominiums?: number[],
	): Promise<ReturnUserListEntity> {
		return {
			success: true,
			data: await this.prisma.user.findMany({
				select: {
					id: true,
					nome: true,
					username: true,
					email: true,
					whatsapp: true,
					ativo: true,
					updated_at: true,
					acessa_todos_departamentos: true,
					empresas: {
						select: {
							empresa_id: true,
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
							departamento_id: true,
							departamento: {
								select: { nome: true },
							},
						},
						where: {
							departamento: {
								empresa_id: user.empresa_id,
							},
						},
					},
				},
				where: await this.getFilterList(user, filtros, condominiums),
				orderBy: {
					nome: 'asc',
				},
			}),
		};
	}

	async report(
		report: ReportUserDto,
		user: UserAuth,
		condominiums: number[],
	) {
		const usersSaved = await this.prisma.user.findMany({
			select: {
				id: true,
				nome: true,
				username: true,
				email: true,
				whatsapp: true,
				ativo: true,
				updated_at: true,
				acessa_todos_departamentos: true,
				empresas: {
					select: {
						empresa_id: true,
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
						departamento_id: true,
						departamento: {
							select: {
								nome: true,
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
			where: await this.getFilterList(user, report.filtros, condominiums),
			orderBy: {
				nome: 'asc',
			},
		});

		const total = usersSaved.length;
		const response = usersSaved.reduce((list: Array<any>, currentValue) => {
			let grupos: { id: number; descricao: string }[] = [];

			grupos = currentValue.departamentos.map((item) => ({
				id: item.departamento_id,
				descricao: `${item.departamento.nome} (${item.departamento.filial.nome})`,
			}));

			if (!grupos.length) return list;

			grupos.forEach((grupo) => {
				let index = list.findIndex((item) => item.id == grupo.id);

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
		}, []);

		return { data: response, total };
	}

	async findOneById(id: number, user: UserAuth): Promise<ReturnUserEntity> {
		const userSaved = await this.prisma.user.findFirst({
			select: {
				id: true,
				nome: true,
				username: true,
				email: true,
				whatsapp: true,
				telefone: true,
				ramal: true,
				ativo: true,
				updated_at: true,
				acessa_todos_departamentos: true,
				empresas: {
					select: {
						empresa_id: true,
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
						departamento_id: true,
						departamento: {
							select: { nome: true },
						},
					},
					where: {
						departamento: {
							empresa_id: user.empresa_id,
						},
					},
				},
				condominios: {
					select: {
						condominio_id: true,
						condominio: {
							select: { nome: true },
						},
					},
					where: {
						condominio: {
							empresa_id: user.empresa_id,
						},
					},
				},
			},
			where: {
				id,
				empresas: {
					some: {
						empresa_id: user.empresa_id,
					},
				},
			},
		});

		if (userSaved == null)
			throw new BadRequestException('Usuário não encontrado');

		return {
			success: true,
			data: userSaved,
		};
	}

	async update(
		id: number,
		user: UserAuth,
		updateUserDto: UpdateUserDto,
	): Promise<ReturnUserEntity> {
		const userSaved = await this.prisma.user.findUnique({ where: { id } });

		if (!userSaved) throw new BadRequestException('Usuário não encontrado');

		if (updateUserDto.username) {
			const userWithUsername = await this.prisma.user.findFirst({
				where: {
					username: updateUserDto.username,
					id: {
						not: id,
					},
				},
			});

			if (userWithUsername)
				throw new BadRequestException('Usuário não pode ser utilizado');
		}

		if (updateUserDto.email) {
			const userWithEmail = await this.prisma.user.findFirst({
				where: {
					email: updateUserDto.email,
					id: {
						not: id,
					},
				},
			});

			if (userWithEmail)
				throw new BadRequestException('Email não pode ser utilizado');
		}

		let userAccessAllDepartments = false;

		if (
			updateUserDto.acessa_todos_departamentos &&
			user.acessa_todos_departamentos
		) {
			userAccessAllDepartments = true;
		}

		let departments = [];
		if (updateUserDto.departamentos) {
			const savedDepartaments = (
				await this.prisma.usuarioHasDepartamentos.findMany({
					where: {
						usuario_id: id,
					},
				})
			).map((department) => department.departamento_id);

			departments = updateUserDto.departamentos.filter(
				(departament) => !savedDepartaments.includes(departament),
			);

			await this.prisma.usuarioHasDepartamentos.deleteMany({
				where: {
					usuario_id: id,
					departamento_id: {
						notIn: savedDepartaments.filter((departament) =>
							updateUserDto.departamentos.includes(departament),
						),
					},
				},
			});
		}

		return {
			success: true,
			message: 'Usuário atualizado com sucesso.',
			data: await this.prisma.user.update({
				select: {
					id: true,
					nome: true,
					username: true,
					email: true,
					whatsapp: true,
					telefone: true,
					ramal: true,
					ativo: true,
					updated_at: true,
					acessa_todos_departamentos: user.acessa_todos_departamentos,
					empresas: {
						select: {
							empresa_id: true,
							cargo: {
								select: {
									id: true,
									nome: true,
								},
							},
						},
					},
					departamentos: {
						select: {
							departamento_id: true,
							departamento: {
								select: { nome: true },
							},
						},
					},
					condominios: {
						select: {
							condominio_id: true,
							condominio: {
								select: { nome: true },
							},
						},
					},
				},
				data: {
					nome: updateUserDto.nome,
					password: updateUserDto.password
						? PasswordHelper.create(updateUserDto.password)
						: undefined,
					username: updateUserDto.username,
					email: updateUserDto.email,
					whatsapp: updateUserDto.whatsapp,
					telefone: updateUserDto.telefone,
					ramal: updateUserDto.ramal,
					ativo:
						updateUserDto.ativo != null
							? updateUserDto.ativo
							: undefined,
					acessa_todos_departamentos: userAccessAllDepartments,
					empresas: {
						updateMany: {
							data: {
								cargo_id: updateUserDto.cargo_id,
							},
							where: {
								empresa_id: user.empresa_id,
								usuario_id: id,
							},
						},
					},
					departamentos: departments
						? {
								createMany: {
									data: departments.map((departamento) => ({
										departamento_id: departamento,
									})),
								},
						  }
						: undefined,
				},
				where: {
					id,
				},
			}),
		};
	}

	async getCondominiums(
		id: number,
		user: UserAuth,
		filterUserCondominiumDto: FilterUserCondominiumDto,
	) {
		const departamentos = (
			await this.prisma.usuarioHasDepartamentos.findMany({
				where: {
					usuario_id: id,
				},
			})
		).map((departamento) => departamento.departamento_id);

		if (
			!departamentos.includes(filterUserCondominiumDto.departamento_id) &&
			!user.acessa_todos_departamentos
		)
			throw new BadRequestException('Departamento não encontrado');

		const condominios = await this.pessoaService.findAll(
			'condominio',
			null,
			{
				departamentos_condominio: {
					some: {
						departamento_id:
							filterUserCondominiumDto.departamento_id,
					},
				},
				usuarios_condominio: {
					some: {
						usuario_id: id,
					},
				},
			},
		);

		const departamento =
			await this.prisma.usuarioHasDepartamentos.findFirst({
				where: {
					departamento_id: filterUserCondominiumDto.departamento_id,
					departamento: {
						empresa_id: user.empresa_id,
					},
					usuario_id: id,
				},
			});

		return {
			condominios_ids: condominios.data.map(
				(condominio) => condominio.id,
			),
			delimitar_acesso: !!departamento?.delimitar_acesso,
		};
	}

	async linkCondominiums(
		id: number,
		user: UserAuth,
		linkCondominiumsDto: LinkCondominiumsDto,
	) {
		const userSaved = await this.prisma.user.findUnique({ where: { id } });

		if (!userSaved) throw new BadRequestException('Usuário não encontrado');

		const departamento =
			await this.prisma.usuarioHasDepartamentos.findFirst({
				where: {
					usuario_id: id,
					departamento_id: linkCondominiumsDto.departamento_id,
				},
			});

		if (!departamento && !user.acessa_todos_departamentos)
			throw new BadRequestException('Departamento não encontrado');

		await this.prisma.usuarioHasCondominios.deleteMany({
			where: {
				usuario_id: id,
				condominio: {
					departamentos_condominio: {
						some: {
							departamento_id:
								linkCondominiumsDto.departamento_id,
						},
					},
				},
			},
		});

		let restrictUserAccess = false;

		if (linkCondominiumsDto.delimitar_acesso) {
			restrictUserAccess = true;

			await this.prisma.usuarioHasCondominios.createMany({
				data: linkCondominiumsDto.condominios_ids.map((condominio) => ({
					condominio_id: condominio,
					usuario_id: id,
				})),
			});
		}

		if (!departamento) {
			await this.prisma.usuarioHasDepartamentos.createMany({
				data: {
					delimitar_acesso: restrictUserAccess,
					usuario_id: id,
					departamento_id: linkCondominiumsDto.departamento_id,
				},
			});
		} else {
			await this.prisma.usuarioHasDepartamentos.updateMany({
				data: {
					delimitar_acesso: restrictUserAccess,
				},
				where: {
					departamento_id: linkCondominiumsDto.departamento_id,
					usuario_id: id,
				},
			});
		}
	}
}
