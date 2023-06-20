import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { CreateOcupationDto } from './dto/create-ocupation.dto';
import { UpdateOcupationDto } from './dto/update-ocupation.dto';
import { OcupationsService } from './ocupations.service';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { Ocupation } from './entities/ocupation.entity';

@ApiTags('Cargos')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('ocupations')
export class OcupationsController {
	constructor(private readonly ocupationsService: OcupationsService) {}

	@Post()
	create(@Body() createOcupationDto: CreateOcupationDto) {
		return this.ocupationsService.create(createOcupationDto);
	}

	@ApiOperation({ summary: 'Listar todos os cargos ativos' })
	@ApiResponse({
		description: 'Cargos listados',
		status: HttpStatus.OK,
		type: Ocupation,
		isArray: true,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os cargos',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error('Erro ao listar os cargos'),
	})
	@Get('active')
	findAllActive() {
		return this.ocupationsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.ocupationsService.findOne(+id);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateOcupationDto: UpdateOcupationDto,
	) {
		return this.ocupationsService.update(+id, updateOcupationDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.ocupationsService.remove(+id);
	}
}
