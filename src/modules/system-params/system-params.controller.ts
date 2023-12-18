import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { JwtAuthGuard } from '../public/auth/guards/jwt-auth.guard';
import { SystemParamList } from './entities/system-param-list.entity';
import { SystemParamsService } from './system-params.service';

@ApiTags('Parâmetros do sistema')
@UseGuards(JwtAuthGuard)
@Controller('system-params')
export class SystemParamsController {
	constructor(private readonly systemParamsService: SystemParamsService) {}

	@Get('active')
	@ApiOperation({ summary: 'Lista todos os parâmetros ativos do sistema' })
	@ApiResponse({
		description: 'Parâmetros listado com sucesso',
		status: HttpStatus.OK,
		type: SystemParamList,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os parâmetros',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findAllActive(@CurrentUser() user: UserAuth) {
		return {
			success: true,
			data: await this.systemParamsService.findAllActive(user.empresa_id),
		};
	}
}
