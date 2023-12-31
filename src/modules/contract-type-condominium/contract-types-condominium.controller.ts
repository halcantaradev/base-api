import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	HttpStatus,
	HttpCode,
	UseGuards,
	Query,
} from '@nestjs/common';
import { ContractTypesCondominiumService } from './contract-types-condominium.service';
import { CreateContractTypesCondominiumDto } from './dto/create-contract-types-condominium.dto';
import { UpdateContractTypesCondominiumDto } from './dto/update-contract-types-condominium.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/shared/decorators/role.decorator';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { JwtAuthGuard } from 'src/modules/public/auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/modules/public/auth/guards/permission.guard';
import { Pagination } from 'src/shared/entities/pagination.entity';
import { ContractTypesCondominiumListReturn } from './dto/contract-types-condominium.-list-return.entity';
import { ContractTypesCondominiumReturn } from './entities/contract-types-condominium-return.entity';
import { FiltersContractTypesCondominiumDto } from './dto/filters-contract-types-condominium.dto';
import { FiltersContractTypesCondominiumActiveDto } from './dto/filters-contract-types-condominium-active.dto';

@ApiTags('Tipos de Contrato')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('contract-types-condominium')
export class ContractTypesCondominiumController {
	constructor(
		private readonly contractTypesCondominiumService: ContractTypesCondominiumService,
	) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@Role('tipo-contrato-cadastrar')
	@ApiOperation({ summary: 'Cria um novo tipo de contrato' })
	@ApiResponse({
		description: 'Tipo de contrato criado com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao criar o tipo de contrato',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async create(
		@Body()
		createContractTypesCondominiumDto: CreateContractTypesCondominiumDto,
	) {
		await this.contractTypesCondominiumService.create(
			createContractTypesCondominiumDto,
		);

		return {
			success: true,
			message: 'Tipo de contrato criado com sucesso',
		};
	}

	@Post('list')
	@Role('tipo-contrato-listar')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Lista todos os tipos de contratos' })
	@ApiResponse({
		description: 'Tipos de contratos listados com sucesso',
		status: HttpStatus.OK,
		type: ContractTypesCondominiumListReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os tipos de contratos',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findAll(
		@Body()
		filtersContractTypesCondominiumDto: FiltersContractTypesCondominiumDto,
		@Query() pagination: Pagination,
	) {
		const dados = await this.contractTypesCondominiumService.findAll(
			filtersContractTypesCondominiumDto,
			pagination,
		);

		return {
			success: true,
			...dados,
		};
	}

	@Post('active')
	@Role('tipo-contrato-listar-ativos')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Lista todos os tipos de contratos ativos' })
	@ApiResponse({
		description: 'Tipos de contratos listados com sucesso',
		status: HttpStatus.OK,
		type: ContractTypesCondominiumListReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os tipos de contratos',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findAllActive(
		@Body()
		filtersContractTypesCondominiumActiveDto: FiltersContractTypesCondominiumActiveDto,
		@Query() pagination: Pagination,
	) {
		const dados = await this.contractTypesCondominiumService.findAll(
			{ ...filtersContractTypesCondominiumActiveDto, ativo: true },
			pagination,
		);

		return {
			success: true,
			...dados,
		};
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	@Role('tipo-contrato-exibir-dados')
	@ApiOperation({ summary: 'Visualiza os dados do tipo de contrato' })
	@ApiResponse({
		description: 'Tipo de contrato listado com sucesso',
		status: HttpStatus.OK,
		type: ContractTypesCondominiumReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os dados do tipo de contrato',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error('Erro ao exibir dados do tipo de contrato'),
	})
	async findOne(@Param('id') id: string) {
		const data = await this.contractTypesCondominiumService.findOne(+id);
		return {
			success: true,
			data,
		};
	}

	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	@Role('tipo-contrato-atualizar')
	@ApiOperation({ summary: 'Atualiza um registro do tipo de contrato' })
	@ApiResponse({
		description: 'Tipo de contrato atualizado com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao atualizado o tipo de contrato',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	update(
		@Param('id') id: string,
		@Body()
		updateContractTypesCondominiumDto: UpdateContractTypesCondominiumDto,
	) {
		return this.contractTypesCondominiumService.update(
			+id,
			updateContractTypesCondominiumDto,
		);
	}
}
