import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordHelper } from 'src/shared/helpers/password.helper';
import { ReturnUserEntity } from './entities/return-user.entity';
import { ReturnUserListEntity } from './entities/return-user-list.entity';

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createUserDto: CreateUserDto, empresa_id: number) {
		await this.prisma.user.create({
			data: {
				nome: createUserDto.nome,
				username: createUserDto.username,
				password: PasswordHelper.create(createUserDto.password),
				email: createUserDto.email,
				empresas_has_usuarios: {
					create: {
						cargo_id: createUserDto.cargo_id,
						empresa_id,
					},
				},
			},
		});

		return { success: true, message: 'Usuário criado com sucesso.' };
	}

	async findAll(empresa_id: number): Promise<ReturnUserListEntity> {
		return {
			success: true,
			data: await this.prisma.user.findMany({
				select: {
					id: true,
					nome: true,
					username: true,
					email: true,
					ativo: true,
					updateda_at: true,
					empresas_has_usuarios: {
						select: {
							empresa_id: true,
							cargo: {
								select: {
									nome: true,
								},
							},
						},
					},
				},
				where: {
					empresas_has_usuarios: {
						every: {
							empresa_id: empresa_id,
						},
					},
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
					updateda_at: true,
					empresas_has_usuarios: {
						select: {
							empresa_id: true,
							cargo: {
								select: {
									nome: true,
								},
							},
						},
					},
				},
				where: {
					empresas_has_usuarios: {
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

	async findOneById(id: number): Promise<ReturnUserEntity> {
		const user = await this.prisma.user.findFirst({
			select: {
				id: true,
				nome: true,
				username: true,
				email: true,
				ativo: true,
				updateda_at: true,
				empresas_has_usuarios: {
					select: {
						empresa_id: true,
						cargo: {
							select: {
								nome: true,
							},
						},
					},
				},
			},
			where: {
				id,
			},
		});

		if (user == null) throw new NotFoundException('Usuário não encontrado');

		return {
			success: true,
			message: 'Usuário listado com sucesso.',
			data: user,
		};
	}

	async update(
		id: number,
		empresa_id: number,
		updateUserDto: UpdateUserDto,
	): Promise<ReturnUserEntity> {
		const user = await this.prisma.user.findUnique({ where: { id } });

		if (user == null) throw new NotFoundException('Usuário não encontrado');

		return {
			success: true,
			message: 'Usuário atualizado com sucesso.',
			data: await this.prisma.user.update({
				select: {
					id: true,
					nome: true,
					username: true,
					email: true,
					ativo: true,
					updateda_at: true,
					empresas_has_usuarios: {
						select: {
							empresa_id: true,
							cargo: {
								select: {
									nome: true,
								},
							},
						},
					},
				},
				data: {
					nome: updateUserDto.nome,
					password: updateUserDto.password
						? PasswordHelper.create(updateUserDto.password)
						: undefined,
					email: updateUserDto.email,
					ativo: updateUserDto.ativo,
					empresas_has_usuarios: {
						updateMany: {
							data: {
								cargo_id: updateUserDto.cargo_id,
							},
							where: {
								empresa_id,
								usuario_id: id,
							},
						},
					},
				},
				where: {
					id,
				},
			}),
		};
	}
}
