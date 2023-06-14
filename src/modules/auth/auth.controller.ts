import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Request,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { LoginEntity } from './entities/login.entity';
import { AuthRequest } from './entities/auth-request.entity';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { UserAuth } from './entities/user-auth.entity';

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
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao realizar o login',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
	})
	@ApiBody({ type: LoginDto })
	@UseGuards(AuthGuard('local'))
	login(@Request() req: AuthRequest) {
		return this.authService.login(req.user);
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
	})
	getProfile(@CurrentUser() user: UserAuth): { nome: string } {
		return { nome: user.nome };
	}
}
