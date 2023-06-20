import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreatePermissionsDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionsService {
	constructor(private readonly prisma: PrismaService) {}

	checkAcess(validPermission: {
		user_id?: number;
		cargo_id?: number;
		action: string;
	}) {
		return this.prisma.permissoes.findFirst({
			include: {
				cargos_has_permissoes: {
					select: { cargo_id: true },
					where: { cargo_id: validPermission.cargo_id || null },
				},
				usuario_has_permissoes: {
					select: { usuario_id: true },
					where: { usuario_id: validPermission.user_id || null },
				},
			},
			where: {
				key: validPermission.action,
			},
		});
	}

	deletePermissionsOcupation(cargo_id: number) {
		return this.prisma.cargosHasPermissoes.deleteMany({
			where: { cargo_id },
		});
	}

	deletePermissionsUser(usuario_id: number) {
		return this.prisma.usuarioHasPermissoes.deleteMany({
			where: { usuario_id },
		});
	}

	async getPermissionsToOcupation(cargo_id: number) {
		return {
			success: true,
			data: await this.prisma.permissoes.findMany({
				select: {
					id: true,
					label: true,
					cargos_has_permissoes: {
						select: { cargo_id: true },
						where: { cargo_id },
					},
				},
			}),
		};
	}

	async givePermissionToOcupation(
		permissionDTO: CreatePermissionsDto,
		empresa_id: number,
		cargo_id: number,
	) {
		await this.deletePermissionsOcupation(cargo_id);
		return this.prisma.cargosHasPermissoes.createMany({
			data: permissionDTO.permissoes.map((permissao_id) => ({
				cargo_id,
				empresa_id,
				permissao_id,
			})),
		});
	}

	async getPermissionsToUser(usuario_id: number) {
		return {
			success: true,
			data: await this.prisma.permissoes.findMany({
				select: {
					id: true,
					label: true,
					usuario_has_permissoes: {
						select: { usuario_id: true },
						where: { usuario_id },
					},
				},
			}),
		};
	}
	async givePermissionToUser(
		permissionDTO: CreatePermissionsDto,
		empresa_id: number,
		usuario_id: number,
	) {
		await this.deletePermissionsUser(usuario_id);
		return this.prisma.usuarioHasPermissoes.createMany({
			data: permissionDTO.permissoes.map((permissao_id) => ({
				usuario_id,
				empresa_id,
				permissao_id,
			})),
		});
	}
}
