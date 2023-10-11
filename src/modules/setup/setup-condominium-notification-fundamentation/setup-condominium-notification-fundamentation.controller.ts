import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/public/auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/modules/public/auth/guards/permission.guard';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { CreateSetupCondominiumNotificationFundamentationDto } from './dto/create-setup-condominium-notification-fundamentation.dto';
import { UpdateSetupCondominiumNotificationFundamentationDto } from './dto/update-setup-condominium-notification-fundamentation.dto';
import { ReturnListSetupCondominiumNotificationFundamentation } from './entities/return-list-setup-condominium-notification-fundamentation.entity';
import { SetupCondominiumNotificationFundamentationService } from './setup-condominium-notification-fundamentation.service';

@ApiTags('Módulo de Configurações')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('setup-condominium-notification-fundamentation')
export class SetupCondominiumNotificationFundamentationController {
	constructor(
		private readonly setupCondominiumNotificationFundamentationService: SetupCondominiumNotificationFundamentationService,
	) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Cadastrar fundamentação legal',
	})
	@ApiResponse({
		description: 'Fundamentação legal criada com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao cadastrar a fundamentação legal',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async create(
		@Body()
		createSetupCondominiumNotificationFundamentationDto: CreateSetupCondominiumNotificationFundamentationDto,
	) {
		await this.setupCondominiumNotificationFundamentationService.create(
			createSetupCondominiumNotificationFundamentationDto,
		);

		return {
			success: true,
			message: 'Fundamentação cadastrada com successo!',
		};
	}

	@Get(':condominio_id')
	@ApiOperation({
		summary: 'Retornas  as fundamentação legal por condomonínio.',
	})
	@ApiResponse({
		description: 'Dundamentação legal listadas com sucesso',
		status: HttpStatus.OK,
		type: ReturnListSetupCondominiumNotificationFundamentation,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar as fundamentações legais',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findAllActive(@Param('condominio_id') condominio_id: string) {
		return {
			success: true,
			data: await this.setupCondominiumNotificationFundamentationService.findAllActive(
				+condominio_id,
			),
		};
	}

	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Atualiza a fundamentação legal.',
	})
	@ApiResponse({
		description: 'Fundamentação legal atualizada com sucesso',
		status: HttpStatus.OK,
		type: ReturnListSetupCondominiumNotificationFundamentation,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao atualizar fundamentação legal',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async update(
		@Param('id') id: string,
		@Body()
		updateSetupCondominiumNotificationFundamentationDto: UpdateSetupCondominiumNotificationFundamentationDto,
	) {
		return {
			success: true,
			message: 'Fundamentação atualizado com successo!',
			data: await this.setupCondominiumNotificationFundamentationService.update(
				+id,
				updateSetupCondominiumNotificationFundamentationDto,
			),
		};
	}

	@Delete(':id')
	@ApiOperation({
		summary: 'Excluir a fundamentação legal.',
	})
	@ApiResponse({
		description: 'Fundamentação legal exluida com sucesso',
		status: HttpStatus.OK,
		type: ReturnListSetupCondominiumNotificationFundamentation,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao excluir fundamentação legal',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async remove(@Param('id') id: string) {
		await this.setupCondominiumNotificationFundamentationService.remove(
			+id,
		);
		return {
			success: true,
			message: 'Fundamentação excluido com successo!',
		};
	}
}
