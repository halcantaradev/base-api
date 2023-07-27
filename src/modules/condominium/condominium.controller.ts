import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
	UseInterceptors,
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
import { FiltersResidenceActiveDto } from './dto/filters-residence-active.dto';
import { Pagination } from 'src/shared/entities/pagination.entity';
import { UserCondominiumsAccess } from 'src/shared/interceptors/user-condominiums-access.decorator';
import { CurrentUserCondominiums } from 'src/shared/decorators/current-user-condominiums.decorator';
import { UsersCondominiumReturn } from './entities/users-condominium-return.entity';
import { LinkTypeContractDto } from './dto/link-type-contract.dto';

@ApiTags('Condominium')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('condominiums')
export class CondominiumController {
	constructor(private readonly condominioService: CondominiumService) {}

	@Post()
	@Role('condominios-listar')
	@UseInterceptors(UserCondominiumsAccess)
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
		@CurrentUserCondominiums() condominiums: number[],
		@CurrentUser() user: UserAuth,
		@Body() filters: FiltersCondominiumDto,
		@Query() pagination: Pagination,
	) {
		const dados = await this.condominioService.findAll(
			filters,
			user,
			condominiums,
			null,
			pagination,
		);

		return {
			success: true,
			...dados,
		};
	}

	@Post('active')
	@Role([
		'condominios-listar-ativos',
		{
			role: 'usuarios-atualizar-vinculos-condominios',
			param: 'usuario_id',
			param_type: 'query',
		},
	])
	@UseInterceptors(UserCondominiumsAccess)
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
		@CurrentUserCondominiums() condominiums: number[],
		@CurrentUser() user: UserAuth,
		@Body() filters: FiltersCondominiumActiveDto,
		@Query('usuario_id') usuario_id?: string,
	) {
		const dados = await this.condominioService.findAll(
			{ ...filters, ativo: true },
			user,
			condominiums,
			+usuario_id,
		);

		return {
			success: true,
			...dados,
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
		type: ReturnEntity.error('Erro ao exibir dados do condominio'),
	})
	async findOne(@CurrentUser() user: UserAuth, @Param('id') id: string) {
		return {
			success: true,
			data: await this.condominioService.findOne(+id, user),
		};
	}

	@Get(':id/responsibles')
	@Role('condominios-exibir-dados')
	@ApiOperation({ summary: 'Lista os responsáveis de um condomínio' })
	@ApiResponse({
		description: 'Responsáveis listados com sucesso',
		status: HttpStatus.OK,
		type: UsersCondominiumReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os responsáveis do condomínio',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(
			'Erro ao exibir os responsáveis do condomínio',
		),
	})
	async findResponsible(
		@CurrentUser() user: UserAuth,
		@Param('id') id: string,
	) {
		return {
			success: true,
			data: await this.condominioService.findResponsible(+id, user),
		};
	}

	@Put(':id_condominium/department')
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

	@Put(':id_condominium/contract')
	@Role('condominios-vincular')
	@ApiOperation({ summary: 'Vincula um tipo de contrato a um condomínio' })
	@ApiResponse({
		description: 'Contrato vinculado com sucesso',
		status: HttpStatus.OK,
		type: CondominiumReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao vincular o contrato',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async linkContract(
		@CurrentUser() user: UserAuth,
		@Param('id_condominium') condominio_id: string,
		@Body() body: LinkTypeContractDto,
	) {
		await this.condominioService.linkContract(
			+condominio_id,
			body.tipo_contrato_id,
			user,
		);

		return {
			success: true,
			message: 'Contrato vinculado com sucesso!',
		};
	}

	@Post('residences')
	@HttpCode(HttpStatus.OK)
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
		@Body() body: FiltersResidenceDto,
		@Query() pagination: Pagination,
	) {
		const dados = await this.condominioService.findAllResidences(
			{ ...body, ativo: true },
			user,
			pagination,
		);

		return {
			success: true,
			...dados,
		};
	}

	@Post('residences/active')
	@HttpCode(HttpStatus.OK)
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
		@Body() body: FiltersResidenceActiveDto,
	) {
		const dados = await this.condominioService.findAllResidences(
			{ ...body, ativo: true },
			user,
		);

		return {
			success: true,
			...dados,
		};
	}

	@Get('residences/:id')
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
		@Query('id_condominium') id_condominium: string,
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
