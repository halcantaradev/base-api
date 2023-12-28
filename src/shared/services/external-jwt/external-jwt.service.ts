import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ExternalJwtService {
	constructor(private jwtService: JwtService) {}

	generateToken(payload: { origin: string; data: any }) {
		return this.jwtService.sign(payload, { expiresIn: '1d' });
	}

	validateToken(token: string) {
		return this.jwtService.verify(token, {
			secret: process.env.EXTERNAL_ACCESS_SECRET,
		});
	}
	generateURLExternal(payload: { origin: string; data: any }) {
		const token = this.generateToken(payload);
		return process.env.APP_URL + '/api/access-docs?doc=' + token;
	}

	generateTokenBySecret(secret: string, payload: any) {
		return this.jwtService.sign(payload, { secret });
	}

	getPayload(token: string, secret: string) {
		return this.jwtService.verify(token, {
			secret,
		});
	}
}
