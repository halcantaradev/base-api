import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthConsumerGuard implements CanActivate {
	constructor(private reflector: Reflector) {}
	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		try {
			const data = context.switchToRpc().getData();

			data.user = new JwtService().verify(data.payload.token, {
				secret: process.env.SECRET,
			});

			return true;
		} catch (error) {
			return false;
		}
	}
}
