import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { UserAuth } from '../../../shared/entities/user-auth.entity';
import { AuthService } from './auth.service';
import { FirstAccessDto } from './dto/first-access.dto';
import { PasswordRecoveryDto } from './dto/password-recovery.dto';
import { RequestFirstAccessDto } from './dto/request-first-access.dto';
import { RequestPasswordRecoveryDto } from './dto/request-password-recovery.dto';
import { LoginEntity } from './entities/login.entity';
import { UserFirstAccess } from './entities/user-first-access.entity';
import { FirstAccessJwtAuthGuard } from './guards/first-access-jwt-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Realiza a autênticação do usuário' })
	@ApiResponse({
		description: 'Usuário autenticado com sucesso',
		status: HttpStatus.OK,
		type: LoginEntity,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao realizar o login',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	@UseGuards(AuthGuard('local'))
	login(@CurrentUser() user: UserAuth) {
		return this.authService.login(user);
	}

	@Get('rocketchat')
	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	async authRocket(@CurrentUser() user: UserAuth) {
		const loginToken = await this.authService.getRocketURL(
			user.id,
			user.empresa_id,
		);
		const token =
			typeof loginToken != 'boolean' ? loginToken.loginToken : '';
		return {
			success: true,
			data: {
				url: process.env.ROCKET_HOST + '?resumeToken=' + token,
				loginToken: token,
			},
		};
	}

	@Get('verify-first-access')
	@HttpCode(HttpStatus.OK)
	@UseGuards(FirstAccessJwtAuthGuard)
	@ApiOperation({
		summary: 'Valida token de primeiro acesso do usuário',
	})
	@ApiResponse({
		description: 'Token validado com sucesso',
		status: HttpStatus.OK,
		type: LoginEntity,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar o token',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar token',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async verifyFirstAccess(@CurrentUser() user: UserFirstAccess) {
		return {
			success: true,
			data: await this.authService.verifyFirstAccess(user),
		};
	}

	@Post('request-password-recovery')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Requisita a troca de senha do usuário',
	})
	@ApiResponse({
		description: 'Requisição atendida',
		status: HttpStatus.OK,
		type: LoginEntity,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao realizar a ação',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async requestPasswordRecovery(
		@Body() requestPasswordRecoveryDto: RequestPasswordRecoveryDto,
	) {
		await this.authService.requestPasswordRecovery(
			requestPasswordRecoveryDto,
		);

		return { success: true, message: 'Email enviado com sucesso!' };
	}

	@Post('password-recovery')
	@HttpCode(HttpStatus.OK)
	@UseGuards(FirstAccessJwtAuthGuard)
	@ApiOperation({
		summary: 'Realiza a troca de senha ao recuperar senha do usuário',
	})
	@ApiResponse({
		description: 'Senha alterada com sucesso',
		status: HttpStatus.OK,
		type: LoginEntity,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao realizar a alteração',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async passwordRecovery(
		@CurrentUser() user: UserFirstAccess,
		@Body() passwordRecoveryDto: PasswordRecoveryDto,
	) {
		return {
			success: true,
			data: await this.authService.passwordRecovery(
				user,
				passwordRecoveryDto,
			),
			message: 'Senha alterada com sucesso!',
		};
	}

	@Post('request-first-access')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Requisita primeiro acesso do usuário',
	})
	@ApiResponse({
		description: 'Requisição atendida',
		status: HttpStatus.OK,
		type: LoginEntity,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao realizar a ação',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async requestFirstAccess(
		@Body() requestFirstAccessDto: RequestFirstAccessDto,
	) {
		await this.authService.requestFirstAccess(requestFirstAccessDto);

		return { success: true, message: 'Email enviado com sucesso!' };
	}

	@Post('first-access')
	@HttpCode(HttpStatus.OK)
	@UseGuards(FirstAccessJwtAuthGuard)
	@ApiOperation({
		summary: 'Realiza a troca de senha no primeiro acesso do usuário',
	})
	@ApiResponse({
		description: 'Senha alterada com sucesso',
		status: HttpStatus.OK,
		type: LoginEntity,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao realizar a alteração',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async firstAccess(
		@CurrentUser() user: UserFirstAccess,
		@Body() firstAccessDto: FirstAccessDto,
	) {
		return {
			success: true,
			data: await this.authService.firstAccess(user, firstAccessDto),
			message: 'Senha alterada com sucesso!',
		};
	}

	@Get('profile')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: 'Retorna os dados salvos no token do usuário' })
	@ApiResponse({
		description: 'Dados listados com sucesso',
		status: HttpStatus.OK,
		type: UserAuth,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os dados',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async getProfile(@CurrentUser() user: UserAuth) {
		return { success: true, data: await this.authService.getProfile(user) };
	}
}
