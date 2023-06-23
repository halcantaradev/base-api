import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsService } from 'src/modules/permissions/permissions.service';

@Injectable()
export class PermissionGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private readonly peermissionService: PermissionsService,
	) {}

	async canActivate(context: ExecutionContext) {
		const roleKey = this.reflector.getAllAndOverride<string>('role', [
			context.getHandler(),
			context.getClass(),
		]);

		const request = context.switchToHttp().getRequest();
		if (roleKey) {
			const permission = await this.peermissionService.checkAcess({
				user_id: request.user.id,
				action: roleKey,
				cargo_id: request.user.cargo_id,
			});

			if (
				permission &&
				!permission.cargos.length &&
				!permission.usuarios.length
			) {
				throw new ForbiddenException(permission.message);
			}
		}

		return true;
	}
}
