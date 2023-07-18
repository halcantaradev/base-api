import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/shared/decorators/role.decorator';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { InfractionService } from './infraction.service';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { PermissionGuard } from 'src/modules/public/auth/guards/permission.guard';
import { JwtAuthGuard } from 'src/modules/public/auth/guards/jwt-auth.guard';
import { CreateInfractionDto } from './dto/create-infraction.dto';
import { ReturnInfractionList } from './entities/return-infraction-list.entity';
import { ReturnInfraction } from './entities/return-infraction.entity';
import { UpdateInfractionDto } from './dto/update-infraction.dto';
import { FilterInfractionDto } from './dto/filter-infraction.dto';
import { FilterInfractionActiveDto } from './dto/filter-infraction-active.dto';

@ApiTags('Infractions')
@Controller('notifications/infractions')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
export class InfractionController {
	constructor(private readonly infractionService: InfractionService) {}

	@Post()
	@Role('notificacoes-infracoes-cadastrar')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Cria um novo tipo de infração' })
	@ApiResponse({
		description: 'Tipo criada com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao criar o tipo',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async create(
		@CurrentUser() user: UserAuth,
		@Body() createInfractionDto: CreateInfractionDto,
	) {
		await this.infractionService.create(user, createInfractionDto);

		return {
			success: true,
			message: 'Tipo de infração criado com sucesso',
		};
	}

	@Post('list')
	@Role('notificacoes-infracoes-listar')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Busca os tipos de notificação',
	})
	@ApiResponse({
		description: 'Tipos listados com sucesso',
		status: HttpStatus.OK,
		type: ReturnInfractionList,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao buscar os tipos',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnInfractionList,
	})
	async findAll(
		@CurrentUser() user: UserAuth,
		@Body() filtros: FilterInfractionDto,
	) {
		return {
			success: true,
			data: await this.infractionService.findAll(user, filtros),
		};
	}

	@Post('active')
	@Role('notificacoes-infracoes-listar-ativos')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Busca os tipos de notificação',
	})
	@ApiResponse({
		description: 'Tipos listados com sucesso',
		status: HttpStatus.OK,
		type: ReturnInfractionList,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao buscar os tipos',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnInfractionList,
	})
	async findAllActive(
		@CurrentUser() user: UserAuth,
		@Body() filtros: FilterInfractionActiveDto,
	) {
		return {
			success: true,
			data: await this.infractionService.findAll(user, {
				...filtros,
				ativo: true,
			}),
		};
	}

	@Get(':id')
	@Role('notificacoes-infracoes-exibir-dados')
	@ApiOperation({ summary: 'Lista os dados de um tipo de infração' })
	@ApiResponse({
		description: 'Dados listados com sucesso',
		status: HttpStatus.OK,
		type: () => ReturnInfraction,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os dados do tipo',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findOne(@Param('id') id: string, @CurrentUser() user: UserAuth) {
		return {
			success: true,
			data: await this.infractionService.findOneById(+id, user),
		};
	}

	@Patch(':id')
	@Role('notificacoes-infracoes-atualizar-dados')
	@ApiOperation({ summary: 'Atualiza os dados de um tipo de infração' })
	@ApiResponse({
		description: 'Tipo atualizado com sucesso',
		status: HttpStatus.OK,
		type: () => ReturnInfraction,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao atualizar o tipo',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async update(
		@Param('id') id: string,
		@CurrentUser() user: UserAuth,
		@Body() updateInfractionDto: UpdateInfractionDto,
	) {
		return {
			success: true,
			message: 'Tipo de infração atualizado com sucesso',
			data: await this.infractionService.update(
				+id,
				user,
				updateInfractionDto,
			),
		};
	}
}
