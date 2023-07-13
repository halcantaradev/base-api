import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Put,
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
import { ListUserDto } from './dto/list-user.dto';
import { ListUserActiveDto } from './dto/list-user-active.dto';
import { LinkCondominiumsDto } from './dto/link-condominiums.dto';
import { ReturnUserCondominiums } from './entities/return-user-condominiums.entity';
import { FilterUserCondominiumDto } from './dto/filter-user-condominium.dto';

@ApiTags('User')
@Controller('users')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
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
	create(
		@CurrentUser() user: UserAuth,
		@Body() createUserDto: CreateUserDto,
	) {
		return this.userService.create(createUserDto, user);
	}

	@Post('list')
	@HttpCode(HttpStatus.OK)
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
	findAll(@CurrentUser() user: UserAuth, @Body() filtros: ListUserDto) {
		return this.userService.findAll(user.empresa_id, filtros);
	}

	@Post('active')
	@HttpCode(HttpStatus.OK)
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
	findAllActive(
		@CurrentUser() user: UserAuth,
		@Body() filters: ListUserActiveDto,
	) {
		return this.userService.findAll(user.empresa_id, {
			...filters,
			ativo: true,
		});
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
	findOne(@Param('id') id: string, @CurrentUser() user: UserAuth) {
		return this.userService.findOneById(+id, user);
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
		@CurrentUser() user: UserAuth,
		@Body() updateUserDto: UpdateUserDto,
	) {
		return this.userService.update(+id, user, updateUserDto);
	}

	@Post(':id/condominiums')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Lista os condominios vinculados do usuário' })
	@ApiResponse({
		description: 'Dados listados com sucesso',
		status: HttpStatus.OK,
		type: ReturnUserCondominiums,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os dados',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async getCondominiums(
		@Param('id') id: string,
		@CurrentUser() user: UserAuth,
		@Body() filterUserCondominiumDto: FilterUserCondominiumDto,
	) {
		return {
			success: true,
			data: await this.userService.getCondominiums(
				+id,
				user,
				filterUserCondominiumDto,
			),
		};
	}

	@Put(':id/condominiums')
	@ApiOperation({ summary: 'Atualiza os condominios vinculados do usuário' })
	@ApiResponse({
		description: 'Dados atualizados com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao atualizar os dados',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async linkCondominiums(
		@Param('id') id: string,
		@CurrentUser() user: UserAuth,
		@Body() linkCondominiumsDto: LinkCondominiumsDto,
	) {
		await this.userService.linkCondominiums(+id, user, linkCondominiumsDto);

		return {
			success: true,
			message: 'Vínculo atualizado com sucesso.',
		};
	}
}
