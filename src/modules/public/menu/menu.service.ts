import { Injectable } from '@nestjs/common';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class MenuService {
	constructor(private readonly prisma: PrismaService) {}

	async findAll(user: UserAuth) {
		return this.prisma.menu.findMany({
			include: {
				items: {
					where: {
						permissao: {
							OR: [
								{
									usuarios: {
										some: {
											empresa_id: user.empresa_id,
											usuario_id: user.id,
										},
									},
								},
								{
									cargos: {
										some: {
											cargo_id: user.cargo_id,
											empresa_id: user.empresa_id,
										},
									},
								},
							],
						},
						ativo: true,
					},
					orderBy: { id: 'asc' },
				},
			},
			where: {
				menu_id: null,
				ativo: true,
				OR: [
					{
						url: null,
						permissao_id: null,
						items: {
							some: {
								permissao: {
									OR: [
										{
											usuarios: {
												some: {
													empresa_id: user.empresa_id,
													usuario_id: user.id,
												},
											},
										},
										{
											cargos: {
												some: {
													cargo: {
														usuarios: {
															some: {
																empresa_id:
																	user.empresa_id,
																usuario_id:
																	user.id,
															},
														},
													},
												},
											},
										},
									],
								},
								ativo: true,
							},
						},
					},
					{
						url: { not: null },
						permissao: {
							OR: [
								{
									usuarios: {
										some: {
											empresa_id: user.empresa_id,
											usuario_id: user.id,
										},
									},
								},
								{
									cargos: {
										some: {
											cargo_id: user.cargo_id,
											empresa_id: user.empresa_id,
										},
									},
								},
							],
						},
						items: {
							none: {
								OR: [{ ativo: true }, { ativo: false }],
							},
						},
					},
				],
			},
			orderBy: { id: 'asc' },
		});
	}
}
