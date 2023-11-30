import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { PasswordHelper } from 'src/shared/helpers/password.helper';
import { EmailService } from 'src/shared/services/email.service';
import { HandlebarsService } from 'src/shared/services/handlebars.service';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { UserAuth } from '../../../shared/entities/user-auth.entity';
import { FirstAccessDto } from './dto/first-access.dto';
import { LoginDataDto } from './dto/login-data.dto';
import { RequestFirstAccessDto } from './dto/request-first-access.dto';
import { UserFirstAccessPayload } from './entities/user-first-access-payload.entity';
import { UserFirstAccess } from './entities/user-first-access.entity';
import { UserPayload } from './entities/user-payload.entity';
import { RequestPasswordRecoveryDto } from './dto/request-password-recovery.dto';
import { PasswordRecoveryDto } from './dto/password-recovery.dto';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private readonly prisma: PrismaService,
		private readonly emailService: EmailService,
		private readonly handleBarService: HandlebarsService,
	) {}

	login(user: LoginDataDto) {
		let token;

		if (user.primeiro_acesso) {
			const userPayload: UserFirstAccessPayload = {
				sub: user.id,
				primeiro_acesso: user.primeiro_acesso,
			};

			token = this.jwtService.sign(userPayload, { expiresIn: '20m' });
		} else {
			const userPayload: UserPayload = {
				sub: user.id,
				nome: user.nome,
				empresa_id: user.empresa_id,
				cargo_id: user.cargo_id,
				departamentos_ids: user.departamentos_ids,
				acessa_todos_departamentos: user.acessa_todos_departamentos,
				primeiro_acesso: user.primeiro_acesso,
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

	async verifyFirstAccess(user: UserFirstAccess) {
		const userData = await this.prisma.user.findFirst({
			where: {
				id: user.id,
				primeiro_acesso: true,
			},
		});

		return !!userData;
	}

	async requestPasswordRecovery(
		requestPasswordRecoveryDto: RequestPasswordRecoveryDto,
	) {
		const userData = await this.prisma.user.findFirst({
			include: { empresas: { select: { empresa_id: true } } },
			where: {
				OR: [
					{ username: requestPasswordRecoveryDto.busca },
					{ email: requestPasswordRecoveryDto.busca },
				],
			},
		});

		if (!userData) return;

		const userPayload: UserFirstAccessPayload = {
			sub: userData.id,
			primeiro_acesso: true,
		};

		const token = await this.jwtService.signAsync(userPayload, {
			expiresIn: '20m',
		});

		const setupEmail = await this.prisma.emailSetup.findFirst({
			where: {
				empresa_id: userData.empresas[0].empresa_id,
				padrao: true,
			},
		});

		const url = process.env.API_URL + '/login/password-recovery/' + token;

		console.log(url);

		let html: Buffer | string = await readFileSync(
			resolve('./src/shared/layouts/recuperacao-senha.html'),
		);

		html = this.handleBarService.compile(html.toString(), {
			url,
		});

		await this.emailService.send({
			from: process.env.EMAIL_SEND_PROVIDER,
			html,
			subject: 'Solicitação de alteração de senha!',
			to: userData.email,
			setup: {
				MAIL_SMTP_HOST: setupEmail.host,
				MAIL_SMTP_PORT: setupEmail.port,
				MAIL_SMTP_SECURE: setupEmail.secure,
				MAIL_SMTP_USER: setupEmail.user,
				MAIL_SMTP_PASS: setupEmail.password,
			},
		});

		return;
	}

	async passwordRecovery(
		user: UserFirstAccess,
		passwordRecoveryDto: PasswordRecoveryDto,
	) {
		if (!user.primeiro_acesso)
			throw new UnauthorizedException('Acesso não permitido');

		if (passwordRecoveryDto.password != passwordRecoveryDto.confirmPassword)
			throw new BadRequestException(
				'Senha não confere com a confirmação da senha',
			);

		const userExists = await this.prisma.user.findFirst({
			where: {
				id: user.id,
			},
		});

		if (!userExists)
			throw new UnauthorizedException('Acesso não permitido');

		if (
			PasswordHelper.compare(
				passwordRecoveryDto.password,
				userExists.password,
			)
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
				password: PasswordHelper.create(passwordRecoveryDto.password),
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

		return loginData.data;
	}

	async requestFirstAccess(requestFirstAccessDto: RequestFirstAccessDto) {
		const userData = await this.prisma.user.findFirst({
			include: { empresas: { select: { empresa_id: true } } },
			where: {
				OR: [
					{ username: requestFirstAccessDto.busca },
					{ email: requestFirstAccessDto.busca },
				],
				primeiro_acesso: true,
			},
		});

		if (!userData) return;

		const userPayload: UserFirstAccessPayload = {
			sub: userData.id,
			primeiro_acesso: userData.primeiro_acesso,
		};

		const token = await this.jwtService.signAsync(userPayload, {
			expiresIn: '20m',
		});

		const setupEmail = await this.prisma.emailSetup.findFirst({
			where: {
				empresa_id: userData.empresas[0].empresa_id,
				padrao: true,
			},
		});

		const url = process.env.API_URL + '/login/first-access/' + token;

		let html: Buffer | string = await readFileSync(
			resolve('./src/shared/layouts/primeiro-acesso.html'),
		);

		html = this.handleBarService.compile(html.toString(), {
			url,
		});

		await this.emailService.send({
			from: process.env.EMAIL_SEND_PROVIDER,
			html,
			subject: 'Primeiro Acesso!',
			to: userData.email,
			setup: {
				MAIL_SMTP_HOST: setupEmail.host,
				MAIL_SMTP_PORT: setupEmail.port,
				MAIL_SMTP_SECURE: setupEmail.secure,
				MAIL_SMTP_USER: setupEmail.user,
				MAIL_SMTP_PASS: setupEmail.password,
			},
		});

		return;
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

		return loginData.data;
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
