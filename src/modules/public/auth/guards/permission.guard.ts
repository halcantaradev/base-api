import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsService } from 'src/modules/public/permissions/permissions.service';
import { PermissionParamDecorator } from 'src/shared/entities/permission-param-decorator.entity';
import { LoggerService } from 'src/shared/services/logger.service';

@Injectable()
export class PermissionGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private readonly permissionService: PermissionsService,
		private loggerService: LoggerService,
	) {}

	async canActivate(context: ExecutionContext) {
		const roles = this.reflector.getAllAndOverride<
			string | Array<PermissionParamDecorator | string>
		>('role', [context.getHandler(), context.getClass()]);

		const request = context.switchToHttp().getRequest();

		const roleKeys = Array.isArray(roles) && roles.length ? roles : [roles];
		if (roleKeys.length && roleKeys[0]) {
			await Promise.all(
				roleKeys.map(async (role) => {
					let param;
					let roleKey;
					let roleParam;

					if (typeof role == 'object') {
						if (role.param) {
							roleKey = role.role;
							roleParam = role.param;

							switch (role.param_type) {
								case 'param':
									param = request.params[role.param];
									break;
								case 'query':
									param = request.query[role.param];
									break;
								case 'body':
									param = request.body[role.param];
									break;
							}
						}
					} else {
						roleKey = role;
					}

					if (!roleParam || param) {
						const permission =
							await this.permissionService.checkAcess({
								user_id: request.user.id,
								action: roleKey,
								cargo_id: request.user.cargo_id,
								empresa_id: request.user.empresa_id,
							});

						if (!permission)
							throw new ForbiddenException(
								`Permissão "${roleKey}" não encontrada!`,
							);

						if (
							permission &&
							!permission.cargos.length &&
							!permission.usuarios.length
						) {
							this.loggerService.send(
								request,
								403,
								permission.message,
							);

							throw new ForbiddenException(permission.message);
						}
					}
				}),
			);
		}

		return true;
	}
}
