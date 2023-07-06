import {
	Controller,
	Get,
	UseGuards,
	HttpStatus,
	Param,
	Body,
	Patch,
} from '@nestjs/common';
import { SetupService } from './setup.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../public/auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../public/auth/guards/permission.guard';
import { Role } from 'src/shared/decorators/role.decorator';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ReturnSetupNotificationEntity } from './entities/return-setup-notification.entity';
import { UpdateSetupNotificationDto } from './dto/update-setup-notification.dto';
import { UpdateSetupSystemDto } from './dto/update-setup-system.dto';

@ApiTags('Setup')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('setup')
export class SetupController {
	constructor(private readonly setupService: SetupService) {}

	@Get('notifications/:id')
	@Role('setup-notificacoes-listar')
	@ApiOperation({ summary: 'Lista os dados de setup de notificações' })
	@ApiResponse({
		description: 'Dados de setup listados com sucesso',
		status: HttpStatus.OK,
		type: ReturnSetupNotificationEntity,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os dados',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async getSetupNotification(@Param('id') id: number) {
		return {
			success: true,
			data: await this.setupService.findSetupNotification(+id),
		};
	}

	@Patch('notifications/:id')
	@Role('setup-notificacoes-atualizar')
	@ApiOperation({ summary: 'Atualiza os dados de setup de notificações' })
	@ApiResponse({
		description: 'Dados de setup atualizados com sucesso',
		status: HttpStatus.OK,
		type: ReturnSetupNotificationEntity,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao atualizar os dados',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async updateSetupNotification(
		@Param('id') id: number,
		@Body() updateSetupNotificationDto: UpdateSetupNotificationDto,
	) {
		return {
			success: true,
			data: await this.setupService.updateSetupNotification(
				+id,
				updateSetupNotificationDto,
			),
		};
	}

	@Get('system/:id')
	@Role('setup-sistema-listar')
	@ApiOperation({ summary: 'Lista os dados de setup de sistema' })
	@ApiResponse({
		description: 'Dados de setup listados com sucesso',
		status: HttpStatus.OK,
		type: ReturnSetupNotificationEntity,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os dados',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async getSetupSystem(@Param('id') id: number) {
		return {
			success: true,
			data: await this.setupService.findSetupSystem(+id),
		};
	}

	@Patch('system/:id')
	@Role('setup-sistema-atualizar')
	@ApiOperation({ summary: 'Atualiza os dados de setup de sistema' })
	@ApiResponse({
		description: 'Dados de setup atualizados com sucesso',
		status: HttpStatus.OK,
		type: ReturnSetupNotificationEntity,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao atualizar os dados',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async updateSetupSystem(
		@Param('id') id: number,
		@Body() updateSetupSystemDto: UpdateSetupSystemDto,
	) {
		return {
			success: true,
			data: await this.setupService.updateSetupSystem(
				+id,
				updateSetupSystemDto,
			),
		};
	}
}
