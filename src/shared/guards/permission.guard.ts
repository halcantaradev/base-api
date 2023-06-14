import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
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
		const permission = await this.peermissionService.permissoesDoUsuario(
			request.user.id,
			roleKey,
			request.user.cargo_id,
		);

		console.log(permission);

		return true;
	}
}
