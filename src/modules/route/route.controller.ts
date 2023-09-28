import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	HttpCode,
	HttpStatus,
	Query,
} from '@nestjs/common';
import { RouteService } from './route.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { Role } from 'src/shared/decorators/role.decorator';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { JwtAuthGuard } from '../public/auth/guards/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from '../public/auth/guards/permission.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { RouteListReturn } from './entities/route-list-return.entity';
import { RouteReturn } from './entities/route-return.entity';
import { Pagination } from 'src/shared/entities/pagination.entity';

@ApiTags('Rotas')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('routes')
export class RouteController {
	constructor(private readonly routeService: RouteService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@Role('rotas-cadastrar')
	@ApiOperation({ summary: 'Cria uma nova rota' })
	@ApiResponse({
		description: 'Rota criada com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao criar a rota',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async create(
		@Body() createRouteDto: CreateRouteDto,
		@CurrentUser() user: UserAuth,
	) {
		await this.routeService.create(createRouteDto, user.empresa_id);

		return {
			success: true,
			message: 'Rota criada com sucesso',
		};
	}

	@Post('list')
	@HttpCode(HttpStatus.OK)
	@Role('rotas-listar')
	@ApiOperation({ summary: 'Lista as rotas' })
	@ApiResponse({
		description: 'Rotas listadas com sucesso',
		status: HttpStatus.OK,
		type: RouteListReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar as rotas',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findAll(
		@CurrentUser() user: UserAuth,
		@Query() pagination: Pagination,
	) {
		const data = await this.routeService.findAll(
			user.empresa_id,
			pagination,
		);

		return {
			success: true,
			...data,
		};
	}

	@Post('active')
	@HttpCode(HttpStatus.OK)
	@Role('rotas-listar-ativos')
	@ApiOperation({ summary: 'Lista as rotas ativas' })
	@ApiResponse({
		description: 'Rotas listadas com sucesso',
		status: HttpStatus.OK,
		type: RouteListReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar as rotas',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findAllActive(
		@CurrentUser() user: UserAuth,
		@Query() pagination: Pagination,
	) {
		const data = await this.routeService.findAllActive(
			user.empresa_id,
			pagination,
		);

		return {
			success: true,
			...data,
		};
	}

	@Get(':id')
	@Role('rotas-exibir-dados')
	@ApiOperation({ summary: 'Lista os dados de uma rota' })
	@ApiResponse({
		description: 'Rota listada com sucesso',
		status: HttpStatus.OK,
		type: RouteReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar a rota',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findOne(@Param('id') id: string, @CurrentUser() user: UserAuth) {
		return {
			success: true,
			data: await this.routeService.findOne(+id, user.empresa_id),
		};
	}

	@Patch(':id')
	@Role('rotas-atualizar-dados')
	@ApiOperation({ summary: 'Atualiza os dados de uma rota' })
	@ApiResponse({
		description: 'Rota atualizada com sucesso',
		status: HttpStatus.OK,
		type: RouteReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao atualizar a rota',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async update(
		@Param('id') id: string,
		@Body() updateRouteDto: UpdateRouteDto,
		@CurrentUser() user: UserAuth,
	) {
		return {
			success: true,
			message: 'Rota atualizada com sucesso',
			data: await this.routeService.update(
				+id,
				updateRouteDto,
				user.empresa_id,
			),
		};
	}

	@Delete(':id')
	@Role('rotas-atualizar-dados')
	@ApiOperation({ summary: 'Deleta uma rota' })
	@ApiResponse({
		description: 'Documento deletado com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao deletar a rota',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async remove(@Param('id') id: string, @CurrentUser() user: UserAuth) {
		await this.routeService.remove(+id, user.empresa_id);

		return {
			success: true,
			message: 'Rota excluída com sucesso',
		};
	}
}
