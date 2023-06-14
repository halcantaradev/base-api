import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordHelper } from 'src/shared/helpers/password.helper';
import { UserPayload } from './entities/user-payload.entity';
import { UserAuth } from './entities/user-auth.entity';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UserService,
		private jwtService: JwtService,
	) {}

	login(user: UserAuth) {
		const userPayload: UserPayload = {
			sub: user.id,
			nome: user.nome,
			empresa_id: user.empresa_id,
			cargo_id: user.cargo_id,
		};

		const token = this.jwtService.sign(userPayload);

		return {
			access_token: token,
		};
	}

	async validateUser(username: string, password?: string) {
		const user = await this.usersService.findOneByUsername(username);

		if (!user) throw new UnauthorizedException();

		if (!user.ativo || !PasswordHelper.compare(password, user?.password)) {
			throw new UnauthorizedException();
		}

		return {
			...user,
			password: undefined,
			empresa_id: user.empresas_has_usuarios[0].empresa_id,
			cargo_id: user.empresas_has_usuarios[0].cargo.id,
		};
	}
}
