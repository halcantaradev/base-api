import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	HttpCode,
	HttpStatus,
} from '@nestjs/common';
import { QueueGeneratePackageService } from './queue-generate-package.service';
import { CreateQueueGeneratePackageDto } from './dto/create-queue-generate-package.dto';
import { UpdateQueueGeneratePackageDto } from './dto/update-queue-generate-package.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../public/auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../public/auth/guards/permission.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { FilterQueueGeneratePackageDto } from './dto/filter-queue-generate-package.dto';
import { Role } from 'src/shared/decorators/role.decorator';
import { QueueGeneratePackageReturn } from './entities/queue-generate-package-return.entity';
import { ReturnEntity } from 'src/shared/entities/return.entity';

@ApiTags('Fila de geração de malotes')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('queue-generate-package')
export class QueueGeneratePackageController {
	constructor(
		private readonly queueGeneratePackageService: QueueGeneratePackageService,
	) {}

	@Post('list')
	@Role('fila-geracao-malotes-listar')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Lista os documentos da na fila de geração de malotes',
	})
	@ApiResponse({
		description: 'Documentos da fila listados com sucesso',
		status: HttpStatus.OK,
		type: QueueGeneratePackageReturn,
	})
	@ApiResponse({
		description: 'Erro ao listar os documentos da fila',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Erro ao listar os documentos da fila',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	async findAll(
		@CurrentUser() user: UserAuth,
		@Body() filters: FilterQueueGeneratePackageDto,
	) {
		return {
			success: true,
			data: await this.queueGeneratePackageService.findAll(
				user.empresa_id,
				filters,
			),
		};
	}
}
