import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { JwtAuthGuard } from '../public/auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../public/auth/guards/permission.guard';
import { OcupationListReturn } from './entities/ocupation-list-return.entity';
import { OcupationsService } from './ocupations.service';

@ApiTags('Cargos')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('ocupations')
export class OcupationsController {
	constructor(private readonly ocupationsService: OcupationsService) {}

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
	@Get('active')
	findAllActive(@Query('busca') busca?: string) {
		return this.ocupationsService.findAllActive(busca);
	}
}
