import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	UseGuards,
} from '@nestjs/common';
import { CondominiumService } from './condominium.service';
import { FiltersCondominiumDto } from './dto/filters.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { PermissionGuard } from '../public/auth/guards/permission.guard';
import { JwtAuthGuard } from '../public/auth/guards/jwt-auth.guard';
import { CondominiumReturn } from './entities/condominium-return.entity';
import { ResidenceReturn } from './entities/residence-return.entity';
import { ResidenceListReturn } from './entities/residence-list-return.entity';
import { CondominiumListReturn } from './entities/condominium-list-return.entity';

@ApiTags('Condominium')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('condominiums')
export class CondominiumController {
	constructor(private readonly condominioService: CondominiumService) {}

	@Post()
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
	async findAll(@Body() filters: FiltersCondominiumDto) {
		return {
			success: true,
			data: await this.condominioService.findAll(filters),
		};
	}

	@Get(':id')
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
	async findOne(@Param('id') id: string) {
		return {
			success: true,
			data: await this.condominioService.findOne(+id),
		};
	}

	@Get(':id_condominium/residences')
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
	async findAllResidences(@Param('id_condominium') id_condominium: string) {
		return {
			success: true,
			data: await this.condominioService.findAllResidences(
				+id_condominium,
			),
		};
	}

	@Get(':id_condominium/residences/:id')
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
		@Param('id_condominium') id_condominium: string,
		@Param('id') id: string,
	) {
		return {
			success: true,
			data: await this.condominioService.findOneResidence(
				+id_condominium,
				+id,
			),
		};
	}
}
