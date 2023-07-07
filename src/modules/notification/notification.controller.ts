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
import { PermissionGuard } from 'src/modules/public/auth/guards/permission.guard';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { JwtAuthGuard } from '../public/auth/guards/jwt-auth.guard';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ReturnNotificationListEntity } from './entities/return-notification-list.entity';
import { ReturnNotificationEntity } from './entities/return-notification.entity';
import { NotificationService } from './notification.service';
import { FilterNotificationDto } from './dto/filter-notification.dto';
import { Role } from 'src/shared/decorators/role.decorator';
import { ReturnInfractionListEntity } from './entities/return-infraction-list.entity';
import { ValidateNotificationDto } from './dto/validate-notification.dto';
import { ReturnValidatedNotificationEntity } from './entities/return-validated-notification.entity';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
export class NotificationController {
	constructor(private readonly notificationService: NotificationService) {}

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
}
