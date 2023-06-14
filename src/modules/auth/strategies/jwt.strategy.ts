import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserPayload } from '../entities/user-payload.entity';
import { UserAuth } from '../../../shared/entities/user-auth.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.SECRET,
		});
	}

	async validate(payload: UserPayload): Promise<UserAuth> {
		return {
			id: payload.sub,
			empresa_id: payload.empresa_id,
			cargo_id: payload.cargo_id,
			nome: payload.nome,
		};
	}
}
