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
import { UserCondominiumsAccess } from 'src/shared/interceptors/user-condominiums-access.interceptor';
import { CurrentUserCondominiums } from 'src/shared/decorators/current-user-condominiums.decorator';
import { UsersCondominiumReturn } from './entities/users-condominium-return.entity';
import { LinkTypeContractDto } from './dto/link-type-contract.dto';
import { ReportCondominiumDto } from './dto/report-condominium.dto';
import { ReportCondominiumReturn } from './entities/report-condominium-return.entity';
import { CreateCondominiumDto } from './dto/create-condominium.dto';
import { UpdateCondominiumDto } from './dto/update-condominium.dto';
import { CondominiumDocumentListReturn } from './entities/condominium-document-list-return.entity';
import { FilterCondominiumDocumentDto } from './dto/filter-condominium-document.dto';

@ApiTags('Condomínios')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('condominiums')
export class CondominiumController {
	constructor(private readonly condominioService: CondominiumService) {}

	@Post()
	@Role('condominios-cadastrar')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Cadastra um novo o condomínio' })
	@ApiResponse({
		description: 'Condomínio criado com sucesso',
		status: HttpStatus.OK,
		type: CondominiumReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao cadastrar o condomínio',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async create(
		@CurrentUser() user: UserAuth,
		@Body() createCondominiumDto: CreateCondominiumDto,
	) {
		await this.condominioService.create(
			user.empresa_id,
			createCondominiumDto,
		);
		return {
			success: true,
			message: 'Condomínio cadastrado com sucesso!',
		};
	}

	@Post('list')
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
	async findAllFiltered(
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

	@Post('list/all')
	@Role('condominios-listar')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Lista todos os condomínios sem delimitações' })
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
			false,
			true,
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
			undefined,
			true,
		);

		return {
			success: true,
			...dados,
		};
	}

	@Post('report')
	@Role('condominios-relatorios')
	@UseInterceptors(UserCondominiumsAccess)
	@ApiOperation({ summary: 'Lista todos os condomínios ativos' })
	@ApiResponse({
		description: 'Condomínios listados com sucesso',
		status: HttpStatus.OK,
		type: ReportCondominiumReturn,
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
	async getReport(
		@CurrentUserCondominiums() condominiums: number[],
		@CurrentUser() user: UserAuth,
		@Body() report: ReportCondominiumDto,
	) {
		const data = await this.condominioService.report(
			{ ...report, filtros: { ...report.filtros, ativo: true } },

			user,
			condominiums,
		);

		return {
			success: true,
			...data,
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

	@Post(':id/documents')
	@Role('condominios-listar-documentos')
	@ApiOperation({ summary: 'Lista os documentos de um condomínio' })
	@ApiResponse({
		description: 'Documentos listados com sucesso',
		status: HttpStatus.OK,
		type: CondominiumDocumentListReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os documentos do condomínio',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error('Erro ao exibir os documentos do condomínio'),
	})
	async findDocuments(
		@Param('id') id: string,
		@CurrentUser() user: UserAuth,
		@Query() pagination: Pagination,
		@Body() filterCondominiumDocumentDto: FilterCondominiumDocumentDto,
	) {
		const data = await this.condominioService.findDocuments(
			+id,
			filterCondominiumDocumentDto,
			user,
			pagination,
		);

		return {
			success: true,
			...data,
		};
	}

	@Patch(':id')
	@Role('condominios-atualizar')
	@ApiOperation({ summary: 'Atualiza os dados de um condomínio' })
	@ApiResponse({
		description: 'Condominium atualizado com sucesso',
		status: HttpStatus.OK,
		type: CondominiumReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao atualizar os dados do condomínio',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async update(
		@CurrentUser() user: UserAuth,
		@Body() body: UpdateCondominiumDto,
		@Param('id') id: string,
	) {
		await this.condominioService.update(user.empresa_id, +id, body);
		return {
			success: true,
			message: 'Condomínio atualizado com sucesso!',
		};
	}

	@Put(':id_condominium/department')
	@Role('condominios-vincular-departamento')
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

	@Put(':id_condominium/contract-type')
	@Role('condominios-vincular-tipo-contrato')
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
			body.tipos_contratos_ids,
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
			body,
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
