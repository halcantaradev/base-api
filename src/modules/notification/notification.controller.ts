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
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Role } from 'src/shared/decorators/role.decorator';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { HandlebarsService } from 'src/shared/services/handlebars.service';
import { LayoutConstsService } from 'src/shared/services/layout-consts.service';
import { PdfService } from 'src/shared/services/pdf.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { FilterNotificationDto } from './dto/filter-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ValidateNotificationDto } from './dto/validate-notification.dto';
import { ReturnInfractionListEntity } from './entities/return-infraction-list.entity';
import { ReturnNotificationListEntity } from './entities/return-notification-list.entity';
import { ReturnNotificationEntity } from './entities/return-notification.entity';
import { ReturnValidatedNotificationEntity } from './entities/return-validated-notification.entity';
import { NotificationService } from './notification.service';
import { PermissionGuard } from '../public/auth/guards/permission.guard';
import { JwtAuthGuard } from '../public/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { UserAuth } from 'src/shared/entities/user-auth.entity';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
export class NotificationController {
	constructor(
		private readonly notificationService: NotificationService,
		private readonly layoutService: LayoutConstsService,
		private readonly handleBarService: HandlebarsService,
		private readonly pdfService: PdfService,
	) {}

	@Post()
	@Role('notificacoes-cadastrar')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Cria uma nova notificação' })
	@ApiResponse({
		description: 'Notificação criada com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao criar a notificação',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	create(@Body() createNotificationDto: CreateNotificationDto) {
		return this.notificationService.create(createNotificationDto);
	}

	@Get()
	@Role('notificacoes-listar')
	@ApiOperation({ summary: 'Lista as notificação' })
	@ApiResponse({
		description: 'Notificações listadas com sucesso',
		status: HttpStatus.OK,
		type: ReturnNotificationListEntity,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar as notificações',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	findAll() {
		return this.notificationService.findAll();
	}

	@Post('search')
	@Role('notificacoes-listar')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Busca as notificação baseado nos filtros enviados',
	})
	@ApiResponse({
		description: 'Notificações encontradas com sucesso',
		status: HttpStatus.OK,
		type: ReturnNotificationListEntity,
	})
	@ApiResponse({
		description:
			'Ocorreu um erro ao buscar as notificações, por favor verifique o campos preenchidos',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnNotificationListEntity,
	})
	search(@Body() filtros: FilterNotificationDto) {
		return this.notificationService.findBy(filtros);
	}

	@Post('validate')
	@Role('notificacoes-cadastrar')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary:
			'Valida as informações da notificação baseado nos dados enviados',
	})
	@ApiResponse({
		description: 'Notificação validada com sucesso',
		status: HttpStatus.OK,
		type: ReturnValidatedNotificationEntity,
	})
	@ApiResponse({
		description:
			'Ocorreu um erro ao validar a notificação, por favor verifique o campos preenchidos',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnNotificationListEntity,
	})
	async validate(@Body() dados: ValidateNotificationDto) {
		return {
			success: true,
			data: await this.notificationService.validateNotification(dados),
		};
	}

	@Post('reports')
	@Role('notificacoes-relatorios-condominio')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary:
			'Gera relação de dados dos filtros para relatorios das notificações',
	})
	@ApiResponse({
		description: 'Dados de relatórios gerados com sucesso',
		status: HttpStatus.OK,
		type: ReturnNotificationListEntity,
	})
	@ApiResponse({
		description:
			'Ocorreu um erro ao gerar os dados para relatório das notificações',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	report(
		@Body() filtros: FilterNotificationDto,
		@Query('tipo') tipo: string,
	) {
		if (+tipo === 2) {
			return this.notificationService.findBy(filtros);
		}
	}

	@Get('infractions')
	@ApiOperation({ summary: 'Lista as infrações de notificação disponíveis' })
	@ApiResponse({
		description: 'Infrações listadas com sucesso',
		status: HttpStatus.OK,
		type: ReturnInfractionListEntity,
		isArray: true,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os infrações',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	findAllInfraction() {
		return this.notificationService.findAllInfraction();
	}

	@Get(':id')
	@Role('notificacoes-exibir-dados')
	@ApiOperation({ summary: 'Lista os dados de uma notificação' })
	@ApiResponse({
		description: 'Notificação listada com sucesso',
		status: HttpStatus.OK,
		type: () => ReturnNotificationEntity,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os dados da notificação',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	findOne(@Param('id') id: string) {
		return this.notificationService.findOneById(+id);
	}

	@Patch(':id')
	@Role('notificacoes-atualizar-dados')
	@ApiOperation({ summary: 'Atualiza os dados de uma notificação' })
	@ApiResponse({
		description: 'Notificação atualizada com sucesso',
		status: HttpStatus.OK,
		type: () => ReturnNotificationEntity,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao atualizar a notificação',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	update(
		@Param('id') id: string,
		@Body() updateNotificationDto: UpdateNotificationDto,
	) {
		return this.notificationService.update(+id, updateNotificationDto);
	}

	@Get('print/:id')
	@Role('notificacoes-exibir-dados')
	@ApiOperation({ summary: 'Imprimir os dados de uma notficação' })
	@ApiResponse({
		description: 'Notificação impressa com sucesso',
		status: HttpStatus.OK,
		type: () => ReturnNotificationEntity,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao imprimir os dados da notificação',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findOnePrint(
		@Param('id') id: string,
		@Query('pdf') pdf?: number,
		@CurrentUser() user?: UserAuth,
	) {
		let html: Buffer | string = readFileSync(
			resolve('./src/shared/layouts/notification.html'),
		);

		const layout = this.layoutService.replaceLayoutVars(html.toString());

		const dataToPrint = await this.notificationService.dataToHandle(
			+id,
			user,
		);
		html = this.handleBarService.compile(layout, dataToPrint);

		if (pdf) {
			const file = await this.pdfService.getPDF(html);
			return {
				success: true,
				data: file,
			};
		}

		return {
			success: true,
			data: html,
		};
	}
}
