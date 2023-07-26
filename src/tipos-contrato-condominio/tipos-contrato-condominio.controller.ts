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
import { TiposContratoCondominioService } from './tipos-contrato-condominio.service';
import { CreateTiposContratoCondominioDto } from './dto/create-tipos-contrato-condominio.dto';
import { UpdateTiposContratoCondominioDto } from './dto/update-tipos-contrato-condominio.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/shared/decorators/role.decorator';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { JwtAuthGuard } from 'src/modules/public/auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/modules/public/auth/guards/permission.guard';
import { Pagination } from 'src/shared/entities/pagination.entity';
import { TiposContratoCondominioListReturn } from './dto/tipos-contrato-condominio-list-return.entity';
import { TiposContratoCondominio } from './entities/tipos-contrato-condominio.entity';

@ApiTags('Tipo de contrato')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('tipos-contrato-condominio')
export class TiposContratoCondominioController {
	constructor(
		private readonly tiposContratoCondominioService: TiposContratoCondominioService,
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
		createTiposContratoCondominioDto: CreateTiposContratoCondominioDto,
	) {
		await this.tiposContratoCondominioService.create(
			createTiposContratoCondominioDto,
		);

		return {
			success: true,
			message: 'Tipo de contrato criado com sucesso',
		};
	}

	@Get()
	@Role('tipo-contrato-listar')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Lista todos os tipos de contratos' })
	@ApiResponse({
		description: 'Tipos de contratos listados com sucesso',
		status: HttpStatus.OK,
		type: TiposContratoCondominioListReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os tipos de contratos',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findAll(@Query() pagination: Pagination) {
		const dados = await this.tiposContratoCondominioService.findAll(
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
		type: TiposContratoCondominio,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os dados do tipo de contrato',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error('Erro ao exibir dados do tipo de contrato'),
	})
	findOne(@Param('id') id: string) {
		return this.tiposContratoCondominioService.findOne(+id);
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
		updateTiposContratoCondominioDto: UpdateTiposContratoCondominioDto,
	) {
		return this.tiposContratoCondominioService.update(
			+id,
			updateTiposContratoCondominioDto,
		);
	}
}
