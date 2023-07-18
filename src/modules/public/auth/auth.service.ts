import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordHelper } from 'src/shared/helpers/password.helper';
import { PrismaService } from 'src/shared/services/prisma.service';
import { UserPayload } from './entities/user-payload.entity';
import { UserAuth } from '../../../shared/entities/user-auth.entity';

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
			departamentos_ids: user.departamentos_ids,
			acessa_todos_departamentos: user.acessa_todos_departamentos,
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

	async getProfile(user: UserAuth) {
		const empresa = await this.prisma.pessoa.findUnique({
			select: {
				nome: true,
			},
			where: {
				id: user.empresa_id,
			},
		});

		return {
			nome: user.nome,
			empresa: empresa.nome,
			acessa_todos_departamentos: user.acessa_todos_departamentos,
		};
	}

	async validateUser(username: string, password?: string) {
		const user = await this.prisma.user.findFirst({
			include: {
				empresas: {
					include: { cargo: true },
				},
				departamentos: {
					include: {
						departamento: true,
					},
				},
			},
			where: {
				username,
				ativo: true,
				empresas: {
					some: {
						cargo: {
							ativo: true,
						},
					},
				},
			},
		});

		if (!user)
			throw new UnauthorizedException('Usuário e/ou senha inválidos');

		if (!user.ativo || !PasswordHelper.compare(password, user?.password)) {
			throw new UnauthorizedException('Usuário e/ou senha inválidos');
		}

		return {
			...user,
			departamentos_ids: user.departamentos.map(
				(departamento) => departamento.departamento_id,
			),
			empresa_id: user.empresas[0].empresa_id,
			cargo_id: user.empresas[0].cargo.id,
		};
	}
}
