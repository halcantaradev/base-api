import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordHelper } from 'src/shared/helpers/password.helper';
import { PrismaService } from 'src/shared/services/prisma.service';
import { UserPayload } from './entities/user-payload.entity';
import { UserAuth } from '../../shared/entities/user-auth.entity';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private readonly prisma: PrismaService,
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
			success: true,
			data: {
				access_token: token,
			},
			message: 'Login realizado com sucesso!',
		};
	}

	async validateUser(username: string, password?: string) {
		const user = await this.prisma.user.findFirst({
			include: {
				empresas: {
					include: { cargo: true },
				},
			},
			where: { username },
		});

		if (!user)
			throw new UnauthorizedException('Usuário e/ou senha inválidos');

		if (!user.ativo || !PasswordHelper.compare(password, user?.password)) {
			throw new UnauthorizedException('Usuário e/ou senha inválidos');
		}

		return {
			...user,
			empresa_id: user.empresas[0].empresa_id,
			cargo_id: user.empresas[0].cargo.id,
		};
	}
}
