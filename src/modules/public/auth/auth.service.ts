import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordHelper } from 'src/shared/helpers/password.helper';
import { PrismaService } from 'src/shared/services/prisma.service';
import { UserPayload } from './entities/user-payload.entity';
import { UserAuth } from '../../../shared/entities/user-auth.entity';
import { UserFirstAccessPayload } from './entities/user-first-access-payload.entity';
import { FirstAccessDto } from './dto/first-access.dto';
import { UserFirstAccess } from './entities/user-first-access.entity';
import { LoginDataDto } from './dto/login-data.dto';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private readonly prisma: PrismaService,
	) {}

	login(user: LoginDataDto) {
		let token;

		if (user.primeiro_acesso) {
			const userPayload: UserFirstAccessPayload = {
				sub: user.id,
				primeiro_acesso: new Date(),
			};

			token = this.jwtService.sign(userPayload);
		} else {
			const userPayload: UserPayload = {
				sub: user.id,
				nome: user.nome,
				empresa_id: user.empresa_id,
				cargo_id: user.cargo_id,
				departamentos_ids: user.departamentos_ids,
				acessa_todos_departamentos: user.acessa_todos_departamentos,
			};

			token = this.jwtService.sign(userPayload);
		}
		return {
			success: true,
			data: {
				access_token: token,
				primeiro_acesso: user.primeiro_acesso,
			},
			message: user.primeiro_acesso
				? 'Altere sua senha para continuar!'
				: 'Login realizado com sucesso!',
		};
	}

	async firstAccess(user: UserFirstAccess, firstAccessDto: FirstAccessDto) {
		if (!user.primeiro_acesso)
			throw new UnauthorizedException('Acesso não permitido');

		if (firstAccessDto.password != firstAccessDto.confirmPassword)
			throw new BadRequestException(
				'Senha não confere com a confirmação da senha',
			);

		const userExists = await this.prisma.user.findFirst({
			where: {
				id: user.id,
				primeiro_acesso: true,
			},
		});

		if (!userExists)
			throw new UnauthorizedException('Acesso não permitido');

		if (
			PasswordHelper.compare(firstAccessDto.password, userExists.password)
		)
			throw new BadRequestException(
				'Digite uma senha diferente da anterior',
			);

		const userData = await this.prisma.user.update({
			include: {
				empresas: {
					include: { cargo: true },
				},
				departamentos: {
					include: {
						departamento: { select: { id: true } },
					},
				},
			},
			data: {
				password: PasswordHelper.create(firstAccessDto.password),
				primeiro_acesso: false,
			},
			where: {
				id: user.id,
			},
		});

		const loginData = await this.login({
			...userData,
			departamentos_ids: userData.departamentos.map(
				(departamento) => departamento.departamento_id,
			),
			empresa_id: userData.empresas[0].empresa_id,
			cargo_id: userData.empresas[0].cargo.id,
		});

		return { ...loginData, message: 'Senha alterada com sucesso!' };
	}

	async getProfile(user: UserAuth) {
		const empresa = await this.prisma.pessoa.findUnique({
			select: {
				id: true,
				nome: true,
				temas: { select: { logo: true }, where: { ativo: true } },
			},
			where: {
				id: user.empresa_id,
			},
		});

		const syncing = await this.prisma.integracaoDatabase.findMany({
			where: { empresa_id: empresa.id, sincronizando: true },
		});

		return {
			nome: user.nome,
			empresa: empresa.nome,
			acessa_todos_departamentos: user.acessa_todos_departamentos,
			temas: empresa.temas,
			syncing: !!syncing.length,
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
						departamento: { select: { id: true } },
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
