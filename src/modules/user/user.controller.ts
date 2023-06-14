import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	UseGuards,
	HttpStatus,
	Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequestEntity } from 'src/shared/entities/request.entity';
import { UserEntity } from './entities/user.entity';
import { Role } from 'src/shared/decorators/role.decorator';
import { PermissionGuard } from 'src/shared/guards/permission.guard';
import { AuthGuard } from '@nestjs/passport';
import { UserAuth } from '../auth/entities/user-auth.entity';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

@ApiTags('User')
@Controller('users')
@UseGuards(PermissionGuard)
@UseGuards(AuthGuard('jwt'))
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	@ApiOperation({ summary: 'Cria um novo usuário' })
	@ApiResponse({
		description: 'Usuário criado com sucesso',
		status: HttpStatus.CREATED,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao criar o usuário',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
	})
	create(
		@Request() req: RequestEntity,
		@Body() createUserDto: CreateUserDto,
	) {
		return this.userService.create(
			createUserDto,
			req.token_data.empresa_id,
		);
	}

	@Get()
	@Role('usuarios-listar-todos')
	@ApiOperation({ summary: 'Lista todos os usuários' })
	@ApiResponse({
		description: 'Usuários listados com sucesso',
		status: HttpStatus.OK,
		type: UserEntity,
		isArray: true,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os usuários',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
	})
	findAll(@CurrentUser() user: UserAuth) {
		return this.userService.findAll(user.empresa_id);
	}

	@Role('usuarios-exibir-dados')
	@Get(':id')
	@ApiOperation({ summary: 'Lista os dados do usuário' })
	@ApiResponse({
		description: 'Dados do usuário listados com sucesso',
		status: HttpStatus.OK,
		type: UserEntity,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os dados usuário',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
	})
	findOne(@Param('id') id: string) {
		return this.userService.findOneById(+id);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Atualiza os dados do usuário' })
	@ApiResponse({
		description: 'Dados do usuário atualizados com sucesso',
		status: HttpStatus.OK,
		type: UserEntity,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao atualizar os dados usuário',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
	})
	update(
		@Param('id') id: string,
		@Request() req: RequestEntity,
		@Body() updateUserDto: UpdateUserDto,
	) {
		return this.userService.update(
			+id,
			req.token_data.empresa_id,
			updateUserDto,
		);
	}
}
