import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { ValidPermissionDTO } from './dto/valid-permission.dto';

@Injectable()
export class PermissionsService {
	constructor(private readonly prisma: PrismaService) {}

	checkAcess(validPermission: {
		user_id?: number;
		cargo_id?: number;
		action: string;
	}) {
		return this.prisma.permissoes.findFirstOrThrow({
			include: {
				cargos_has_ermissoes: {
					select: { id: true },
					where: { cargo_id: validPermission.cargo_id || null },
				},
				usuario_has_permissoes: {
					select: { id: true },
					where: { usuario_id: validPermission.user_id || null },
				},
			},
			where: {
				key: validPermission.action,
			},
		});
	}
}
