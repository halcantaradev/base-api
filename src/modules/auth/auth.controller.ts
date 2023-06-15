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
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginEntity } from './entities/login.entity';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { UserAuth } from '../../shared/entities/user-auth.entity';
import { ReturnEntity } from 'src/shared/entities/return.entity';

@ApiTags('Auth')
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
	login(@CurrentUser() user: UserAuth, @Body() _: LoginDto) {
		return this.authService.login(user);
	}

	@Get('profile')
	@UseGuards(AuthGuard('jwt'))
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
	getProfile(@CurrentUser() user: UserAuth) {
		return { nome: user.nome };
	}
}
