import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreatePermissionOcupationDto } from './dto/create-permission-ocupation.dto';
import { CreatePermissionUserDto } from './dto/create-permission-user.dto';

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

	async givePermissionToOcupation(
		permissionDTO: CreatePermissionOcupationDto[],
		empresa_id: number,
	) {
		await this.deletePermissionsOcupation(permissionDTO[0].cargo_id);
		return this.prisma.cargosHasPermissoes.createMany({
			data: permissionDTO.map((item) => ({
				cargo_id: item.cargo_id,
				empresa_id,
				permissao_id: item.permissao_id,
			})),
		});
	}

	async givePermissionToUser(
		permissionDTO: CreatePermissionUserDto[],
		empresa_id: number,
	) {
		await this.deletePermissionsUser(permissionDTO[0].usuario_id);
		return this.prisma.usuarioHasPermissoes.createMany({
			data: permissionDTO.map((item) => ({
				usuario_id: item.usuario_id,
				empresa_id,
				permissao_id: item.permissao_id,
			})),
		});
	}
}
