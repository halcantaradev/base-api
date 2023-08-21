import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { layoutConst } from 'src/shared/consts/layout.const';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Role } from 'src/shared/decorators/role.decorator';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { JwtAuthGuard } from '../public/auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../public/auth/guards/permission.guard';
import { CreateLayoutsNotificationDto } from './dto/create-layouts-notification.dto';
import { UpdateLayoutsNotificationDto } from './dto/update-layouts-notification.dto';
import {
	LayoutConstsReturn,
	LayoutsNotificationListReturn,
	LayoutsNotificationReturn,
} from './entities/layouts-notification-return.entity';
import { LayoutsNotificationService } from './layouts-notification.service';

@ApiTags('Modelos de Impressão de Notificações')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('layouts-notification')
export class LayoutsNotificationController {
	constructor(
		private readonly layoutsNotificationService: LayoutsNotificationService,
	) {}

	@ApiOperation({ summary: 'Cadastrar um modelo de impressão' })
	@ApiResponse({
		description: 'Cadastrar modelos',
		status: HttpStatus.OK,
		type: ReturnEntity.success('Modelo cadastrado com sucesso'),
		isArray: true,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar o modelo',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error('Erro ao validar modelo'),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao cadastrar modelo',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error('Erro ao cadastrar modelo'),
	})
	@Role('layouts-notificacao-cadastrar')
	@HttpCode(HttpStatus.OK)
	@Post()
	async create(
		@Body() createLayoutsNotificationDto: CreateLayoutsNotificationDto,
		@CurrentUser() user: UserAuth,
	) {
		await this.layoutsNotificationService.create(
			createLayoutsNotificationDto,
			user.empresa_id,
		);
		return {
			success: true,
			message: 'Modelo cadastrado com sucesso',
		};
	}

	@ApiOperation({ summary: 'Listar os modelos de impressão' })
	@ApiResponse({
		description: 'Listar modelos',
		status: HttpStatus.OK,
		type: LayoutsNotificationListReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os modelos',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error('Erro ao listar modelo'),
	})
	@Role('layouts-notificacao-listar')
	@Get()
	async findAll(@CurrentUser() user: UserAuth) {
		return {
			success: true,
			data: await this.layoutsNotificationService.findAll(
				user.empresa_id,
			),
		};
	}

	@ApiOperation({ summary: 'Listar os modelos de impressão ativos' })
	@ApiResponse({
		description: 'Listar modelos ativos',
		status: HttpStatus.OK,
		type: LayoutsNotificationListReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os modelos ativos',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error('Erro ao listar modelo ativos'),
	})
	@Role('layouts-notificacao-listar-ativos')
	@Get('ativos')
	async findAllActive(@CurrentUser() user: UserAuth) {
		return {
			success: true,
			data: await this.layoutsNotificationService.findAll(
				user.empresa_id,
				true,
			),
		};
	}

	@ApiOperation({ summary: 'Listar constantes para layouts' })
	@ApiResponse({
		description: 'Listar constantes',
		status: HttpStatus.OK,
		type: LayoutConstsReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar as constantes',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error('Erro ao listar constantes'),
	})
	@Role('layouts-notificacao-listar-constantes')
	@Get('consts')
	findConsts() {
		return {
			success: true,
			data: layoutConst.map((item) => ({
				label: item.label,
				const: item.const,
			})),
		};
	}

	@ApiOperation({ summary: 'Atualizar um modelo de impressão' })
	@ApiResponse({
		description: 'Atualizar modelos',
		status: HttpStatus.OK,
		type: ReturnEntity.success('Modelo atualizado com sucesso'),
		isArray: true,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar o modelo',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error('Erro ao validar modelo'),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao atualizar modelo',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error('Erro ao atualizar modelo'),
	})
	@Role('layouts-notificacao-atualizar')
	@Patch(':id')
	async update(
		@Param('id') id: string,
		@Body() updateLayoutsNotificationDto: UpdateLayoutsNotificationDto,
		@CurrentUser() user: UserAuth,
	) {
		await this.layoutsNotificationService.update(
			+id,
			updateLayoutsNotificationDto,
			user.empresa_id,
		);

		return {
			success: true,
			message: 'Modelo atualizado com sucesso',
		};
	}

	@ApiOperation({ summary: 'Exibir dados de um modelos de impressão' })
	@ApiResponse({
		description: 'Exibir dados de um modelo',
		status: HttpStatus.OK,
		type: LayoutsNotificationReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao exibir os dados do modelo',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error('Erro ao exibir dados do modelo'),
	})
	@Role('layouts-notificacao-exibir-dados')
	@Get(':id')
	async findOne(@Param('id') id: string, @CurrentUser() user: UserAuth) {
		return {
			success: true,
			data: await this.layoutsNotificationService.findOne(
				+id,
				user.empresa_id,
			),
		};
	}
}
