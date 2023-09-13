import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { NotificationEventsService } from './notification-events.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { NotificationEventListReturn } from './entities/notification-event-list-return.entity';
import { JwtAuthGuard } from '../public/auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../public/auth/guards/permission.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { UserAuth } from 'src/shared/entities/user-auth.entity';

@ApiTags('Notificações de eventos')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('notification-events')
export class NotificationEventsController {
	constructor(
		private readonly notificationEventsService: NotificationEventsService,
	) {}

	@Get()
	@ApiOperation({ summary: 'Lista todas as notificações de eventos' })
	@ApiResponse({
		description: 'Notificações listadas com sucesso',
		status: HttpStatus.OK,
		type: NotificationEventListReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar as notificações',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findAll(@CurrentUser() user: UserAuth) {
		return {
			success: true,
			data: await this.notificationEventsService.findAll(user),
		};
	}
}
