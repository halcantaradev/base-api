import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class PermissionsService {
	constructor(private readonly prisma: PrismaService) {}

	permissoesDoUsuario(
		user_id: number,
		key_permission: string,
		cargo_id: number,
	) {
		return this.prisma.permissoes.findFirst({
			include: {
				cargos_has_ermissoes: {
					select: { id: true },
					where: { cargo_id },
				},
			},
			where: {
				key: key_permission,
			},
		});
	}
}