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
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { ReturnSetupSystemEntity } from './entities/return-setup-system.entity';
import { ReturnSetupPackageEntity } from './entities/return-setup-package.entity';
import { UpdateSetupPackageDto } from './dto/update-setup-package.dto';
import { ReturnSetupPackageDriverListEntity } from './entities/return-setup-package-driver.entity';
import { ReturnSetupPackageRouteListEntity } from './entities/return-setup-package-route.entity';

@ApiTags('Módulo de Configurações')
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
			message: 'Configurações atualizadas com sucesso!',
			data: await this.setupService.updateSetupNotification(
				+id,
				updateSetupNotificationDto,
			),
		};
	}

	@Get('packages/routes')
	@Role('setup-malotes-listar-rotas')
	@ApiOperation({ summary: 'Lista as rotas de malotes disponíveis' })
	@ApiResponse({
		description: 'Rotas listadas com sucesso',
		status: HttpStatus.OK,
		type: ReturnSetupPackageRouteListEntity,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os dados',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async getRoutesPackage(@CurrentUser() user: UserAuth) {
		return {
			success: true,
			data: await this.setupService.findRoutesPackage(user.empresa_id),
		};
	}

	@Get('packages/drivers')
	@Role('setup-malotes-listar-motoristas')
	@ApiOperation({ summary: 'Lista as motoristas de malotes disponíveis' })
	@ApiResponse({
		description: 'Motoristas listados com sucesso',
		status: HttpStatus.OK,
		type: ReturnSetupPackageDriverListEntity,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os dados',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async getDriversPackage(@CurrentUser() user: UserAuth) {
		return {
			success: true,
			data: await this.setupService.findDriversPackage(user.empresa_id),
		};
	}

	@Get('packages/:id')
	@Role('setup-malotes-listar')
	@ApiOperation({ summary: 'Lista os dados de setup de malotes' })
	@ApiResponse({
		description: 'Dados de setup listados com sucesso',
		status: HttpStatus.OK,
		type: ReturnSetupPackageEntity,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os dados',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async getSetupPackage(@Param('id') id: number) {
		return {
			success: true,
			data: await this.setupService.findSetupPackage(+id),
		};
	}

	@Patch('packages/:id')
	@Role('setup-malotes-atualizar')
	@ApiOperation({ summary: 'Atualiza os dados de setup de malotes' })
	@ApiResponse({
		description: 'Dados de setup atualizados com sucesso',
		status: HttpStatus.OK,
		type: ReturnSetupPackageEntity,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao atualizar os dados',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async updateSetupPackage(
		@Param('id') id: number,
		@Body() updateSetupPackageDto: UpdateSetupPackageDto,
	) {
		return {
			success: true,
			message: 'Configurações atualizadas com sucesso!',
			data: await this.setupService.updateSetupPackage(
				+id,
				updateSetupPackageDto,
			),
		};
	}

	@Get('system')
	@Role('setup-sistema-listar')
	@ApiOperation({ summary: 'Lista os dados de setup de sistema' })
	@ApiResponse({
		description: 'Dados de setup listados com sucesso',
		status: HttpStatus.OK,
		type: ReturnSetupSystemEntity,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os dados',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async getSetupSystem(@CurrentUser() user: UserAuth) {
		return {
			success: true,
			data: await this.setupService.findSetupSystem(+user.empresa_id),
		};
	}

	@Patch('system')
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
		@CurrentUser() user: UserAuth,
		@Body() updateSetupSystemDto: UpdateSetupSystemDto,
	) {
		return {
			success: true,
			message: 'Configurações atualizadas com sucesso!',
			data: await this.setupService.updateSetupSystem(
				+user.empresa_id,
				updateSetupSystemDto,
			),
		};
	}
}
