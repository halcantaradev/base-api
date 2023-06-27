import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Param,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from 'src/modules/public/auth/guards/permission.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { UserAuth } from '../../shared/entities/user-auth.entity';
import { JwtAuthGuard } from '../public/auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReturnUserListEntity } from './entities/return-user-list.entity';
import { ReturnUserEntity } from './entities/return-user.entity';
import { UserService } from './user.service';
import { Role } from 'src/shared/decorators/role.decorator';

@ApiTags('User')
@Controller('users')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	@ApiOperation({ summary: 'Cria um novo usuário' })
	@ApiResponse({
		description: 'Usuário criado com sucesso',
		status: HttpStatus.CREATED,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao criar o usuário',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	create(@CurrentUser() req: UserAuth, @Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto, req.empresa_id);
	}

	@Get()
	@Role('usuarios-listar-todos')
	@ApiOperation({ summary: 'Lista todos os usuários' })
	@ApiResponse({
		description: 'Usuários listados com sucesso',
		status: HttpStatus.OK,
		type: ReturnUserListEntity,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os usuários',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	findAll(@CurrentUser() user: UserAuth) {
		return this.userService.findAll(user.empresa_id);
	}

	@Get('active')
	@Role('usuarios-listar-ativos')
	@ApiOperation({ summary: 'Lista usuários ativos' })
	@ApiResponse({
		description: 'Usuários ativos listados com sucesso',
		status: HttpStatus.OK,
		type: ReturnUserListEntity,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os usuários',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	findAllActive(@CurrentUser() user: UserAuth) {
		return this.userService.findAll(user.empresa_id);
	}

	@Get(':id')
	@Role('usuarios-exibir-dados')
	@ApiOperation({ summary: 'Lista os dados do usuário' })
	@ApiResponse({
		description: 'Dados do usuário listados com sucesso',
		status: HttpStatus.OK,
		type: ReturnUserEntity,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os dados usuário',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	findOne(@Param('id') id: string) {
		return this.userService.findOneById(+id);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Atualiza os dados do usuário' })
	@ApiResponse({
		description: 'Dados do usuário atualizados com sucesso',
		status: HttpStatus.OK,
		type: ReturnUserEntity,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao atualizar os dados usuário',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	update(
		@Param('id') id: string,
		@CurrentUser() req: UserAuth,
		@Body() updateUserDto: UpdateUserDto,
	) {
		return this.userService.update(+id, req.empresa_id, updateUserDto);
	}
}
