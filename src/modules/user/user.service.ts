import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordHelper } from 'src/shared/helpers/password.helper';
import { ReturnUserEntity } from './entities/return-user.entity';
import { ReturnUserListEntity } from './entities/return-user-list.entity';
import { ListUserDto } from './dto/list-user.dto';
import { UserAuth } from 'src/shared/entities/user-auth.entity';

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createUserDto: CreateUserDto, user: UserAuth) {
		await this.prisma.user.create({
			data: {
				nome: createUserDto.nome,
				username: createUserDto.username,
				password: PasswordHelper.create(createUserDto.password),
				email: createUserDto.email,
				telefone: createUserDto.telefone,
				ramal: createUserDto.ramal,
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
				condominios: createUserDto.condominios
					? {
							createMany: {
								data: createUserDto.condominios.map(
									(departamento) => ({
										condominio_id: departamento,
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
		empresa_id: number,
		filtros: ListUserDto = {},
	): Promise<ReturnUserListEntity> {
		return {
			success: true,
			data: await this.prisma.user.findMany({
				select: {
					id: true,
					nome: true,
					username: true,
					email: true,
					ativo: true,
					updated_at: true,
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
				},
				where: {
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
					empresas: {
						every: {
							empresa_id: empresa_id,
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
				},
				orderBy: {
					nome: 'asc',
				},
			}),
		};
	}

	async findAllActive(empresa_id: number): Promise<ReturnUserListEntity> {
		return {
			success: true,
			data: await this.prisma.user.findMany({
				select: {
					id: true,
					nome: true,
					username: true,
					email: true,
					ativo: true,
					updated_at: true,
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
				},
				where: {
					empresas: {
						every: {
							empresa_id: empresa_id,
						},
					},
					ativo: true,
				},
				orderBy: {
					nome: 'asc',
				},
			}),
		};
	}

	async findOneById(id: number, user: UserAuth): Promise<ReturnUserEntity> {
		const userSaved = await this.prisma.user.findFirst({
			select: {
				id: true,
				nome: true,
				username: true,
				email: true,
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
			where: {
				id,
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

		return {
			success: true,
			message: 'Usuário atualizado com sucesso.',
			data: await this.prisma.user.update({
				select: {
					id: true,
					nome: true,
					username: true,
					email: true,
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
					departamentos: updateUserDto.departamentos
						? {
								deleteMany: {
									usuario_id: id,
								},
								createMany: {
									data: updateUserDto.departamentos.map(
										(departamento) => ({
											departamento_id: departamento,
										}),
									),
								},
						  }
						: undefined,
					condominios: updateUserDto.condominios
						? {
								deleteMany: {
									usuario_id: id,
								},
								createMany: {
									data: updateUserDto.condominios.map(
										(departamento) => ({
											condominio_id: departamento,
										}),
									),
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
}
