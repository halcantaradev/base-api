import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class JwtWSAuthGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}

	canActivate(
		context: ExecutionContext,
	): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
		const client: Socket = context.switchToWs().getClient();

		try {
			const tokenPayload =
				context.getArgs()[0].handshake.headers.authorization;

			const [method, token] = tokenPayload.split(' ');

			if (method !== 'Bearer' || !token) {
				throw new Error();
			}

			this.jwtService.verify(token, {
				secret: process.env.SECRET,
			});

			return true;
		} catch (ex) {
			client.disconnect();
			return false;
		}
	}
}
