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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { JwtAuthGuard } from '../public/auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../public/auth/guards/permission.guard';
import { OcupationListReturn } from './entities/ocupation-list-return.entity';
import { OcupationsService } from './ocupations.service';
import { Role } from 'src/shared/decorators/role.decorator';
import { CreateOcupationDto } from './dto/create-ocupation.dto';
import { UpdateOcupationDto } from './dto/update-ocupation.dto';

@ApiTags('Cargos')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('ocupations')
export class OcupationsController {
	constructor(private readonly ocupationsService: OcupationsService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@Role('cargos-cadastrar')
	@ApiOperation({ summary: 'Cria um novo cargo' })
	@ApiResponse({
		description: 'Cargo criado com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao criar o cargo',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async create(@Body() createOcupationDto: CreateOcupationDto) {
		await this.ocupationsService.create(createOcupationDto);

		return { success: true, message: 'Cargo criado com sucesso' };
	}

	@Get('list')
	@HttpCode(HttpStatus.OK)
	@Role('cargos-listar')
	@ApiOperation({ summary: 'Lista todos os cargos' })
	@ApiResponse({
		description: 'Cargos listados com sucesso',
		status: HttpStatus.OK,
		type: OcupationListReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os cargos',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findAll(@Query('busca') busca?: string) {
		return {
			success: true,
			data: await this.ocupationsService.findAll(busca),
		};
	}

	@Get('active')
	@Role('cargos-listar-ativos')
	@ApiOperation({ summary: 'Listar todos os cargos ativos' })
	@ApiResponse({
		description: 'Cargos listados',
		status: HttpStatus.OK,
		type: OcupationListReturn,
		isArray: true,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os cargos',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error('Erro ao listar os cargos'),
	})
	async findAllActive(@Query('busca') busca?: string) {
		return {
			success: true,
			data: await this.ocupationsService.findAll(busca, true),
		};
	}

	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	@Role('cargos-atualizar-dados')
	@ApiOperation({ summary: 'Atualiza os dados de um cargo' })
	@ApiResponse({
		description: 'Cargo atualizado com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao atualizar o cargo',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async update(
		@Param('id') id: string,
		@Body() updateOcupationDto: UpdateOcupationDto,
	) {
		await this.ocupationsService.update(+id, updateOcupationDto);

		return { success: true, message: 'Cargo criado com sucesso' };
	}
}
