import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PermissionsService } from 'src/modules/permissions/permissions.service';

@Injectable()
export class PermissionGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private readonly permissionsService: PermissionsService,
	) {}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const roleKey = this.reflector.getAllAndOverride<string>('role', [
			context.getHandler(),
			context.getClass(),
		]);

		const request = context.switchToHttp().getRequest();

		console.log(request.user);

		return true;
	}
}
