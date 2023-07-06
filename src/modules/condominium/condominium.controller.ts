import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { CondominiumService } from './condominium.service';
import { FiltersCondominiumDto } from './dto/filters-condominium.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { PermissionGuard } from '../public/auth/guards/permission.guard';
import { JwtAuthGuard } from '../public/auth/guards/jwt-auth.guard';
import { CondominiumReturn } from './entities/condominium-return.entity';
import { ResidenceReturn } from './entities/residence-return.entity';
import { ResidenceListReturn } from './entities/residence-list-return.entity';
import { CondominiumListReturn } from './entities/condominium-list-return.entity';
import { LinkDepartamentDto } from './dto/link-department.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { Role } from 'src/shared/decorators/role.decorator';
import { FiltersResidenceDto } from './dto/filters-residence.dto';
import { FiltersCondominiumActiveDto } from './dto/filters-condominium-active.dto';

@ApiTags('Condominium')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('condominiums')
export class CondominiumController {
	constructor(private readonly condominioService: CondominiumService) {}

	@Post()
	@Role('condominios-listar')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Lista todos os condomínios' })
	@ApiResponse({
		description: 'Condomínios listados com sucesso',
		status: HttpStatus.OK,
		type: CondominiumListReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os filtros enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os condomínios',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findAll(
		@CurrentUser() user: UserAuth,
		@Body() filters: FiltersCondominiumDto,
	) {
		return {
			success: true,
			data: await this.condominioService.findAll(filters, user),
		};
	}

	@Post('active')
	@Role('condominios-listar-ativos')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Lista todos os condomínios ativos' })
	@ApiResponse({
		description: 'Condomínios listados com sucesso',
		status: HttpStatus.OK,
		type: CondominiumListReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os filtros enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os condomínios',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findAllActive(
		@CurrentUser() user: UserAuth,
		@Body() filters: FiltersCondominiumActiveDto,
	) {
		return {
			success: true,
			data: await this.condominioService.findAllActive(filters, user),
		};
	}

	@Get(':id')
	@Role('condominios-exibir-dados')
	@ApiOperation({ summary: 'Lista os dados de um condomínio' })
	@ApiResponse({
		description: 'Condomínio listado com sucesso',
		status: HttpStatus.OK,
		type: CondominiumReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os dados do condomínio',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findOne(@CurrentUser() user: UserAuth, @Param('id') id: string) {
		return {
			success: true,
			data: await this.condominioService.findOne(+id, user),
		};
	}

	@Patch(':id_condominium')
	@Role('condominios-vincular')
	@ApiOperation({ summary: 'Vincula um departamento a um condomínio' })
	@ApiResponse({
		description: 'Condomínio vinculado com sucesso',
		status: HttpStatus.OK,
		type: CondominiumReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os filtros enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao vincular o departamento',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async linkDepartament(
		@CurrentUser() user: UserAuth,
		@Param('id_condominium') condominio_id: string,
		@Body() body: LinkDepartamentDto,
	) {
		return {
			success: true,
			message: 'Condomínio vinculado com sucesso!',
			data: await this.condominioService.linkDepartament(
				+condominio_id,
				body.departamento,
				user,
			),
		};
	}

	@Post(':id_condominium/residences')
	@Role('unidades-listar')
	@ApiOperation({ summary: 'Lista todos as unidades' })
	@ApiResponse({
		description: 'Unidades listadas com sucesso',
		status: HttpStatus.OK,
		type: ResidenceListReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar as unidades',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findAllResidences(
		@CurrentUser() user: UserAuth,
		@Param('id_condominium') id_condominium: string,
		@Body() body: FiltersResidenceDto,
	) {
		return {
			success: true,
			data: await this.condominioService.findAllResidences(
				+id_condominium,
				body,
				user,
			),
		};
	}

	@Get(':id_condominium/residences/active')
	@Role('unidades-listar-ativos')
	@ApiOperation({ summary: 'Lista todos as unidades ativas' })
	@ApiResponse({
		description: 'Unidades listadas com sucesso',
		status: HttpStatus.OK,
		type: ResidenceListReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar as unidades',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findAllResidencesActive(
		@CurrentUser() user: UserAuth,
		@Param('id_condominium') id_condominium: string,
		@Query('busca') busca?: string,
	) {
		return {
			success: true,
			data: await this.condominioService.findAllResidences(
				+id_condominium,
				{ busca, ativo: true },
				user,
			),
		};
	}

	@Get(':id_condominium/residences/:id')
	@Role('unidades-exibir-dados')
	@ApiOperation({ summary: 'Lista os dados de uma unidade' })
	@ApiResponse({
		description: 'Unidade listada com sucesso',
		status: HttpStatus.OK,
		type: ResidenceReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os dados da unidade',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findOneResidence(
		@CurrentUser() user: UserAuth,
		@Param('id_condominium') id_condominium: string,
		@Param('id') id: string,
	) {
		return {
			success: true,
			data: await this.condominioService.findOneResidence(
				+id_condominium,
				+id,
				user,
			),
		};
	}
}
