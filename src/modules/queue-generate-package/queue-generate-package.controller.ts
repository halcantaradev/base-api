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
	UseInterceptors,
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
import { UserCondominiumsAccess } from 'src/shared/interceptors/user-condominiums-access.interceptor';
import { QueueGeneratePackageReturn } from './entities/queue-generate-package-return.entity';

@ApiTags('Fila de geração de malotes')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('queue-generate-package')
export class QueueGeneratePackageController {
	constructor(
		private readonly queueGeneratePackageService: QueueGeneratePackageService,
	) {}

	@Post()
	create(
		@Body() createQueueGeneratePackageDto: CreateQueueGeneratePackageDto,
	) {
		return this.queueGeneratePackageService.create(
			createQueueGeneratePackageDto,
		);
	}

	@Post('list')
	@Role('fila-geracao-malotes-listar')
	@UseInterceptors(UserCondominiumsAccess)
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Lista os documentos da na fila de geração de malotes',
	})
	@ApiResponse({
		description: 'Documentos da fila listados com sucesso',
		status: HttpStatus.OK,
		type: QueueGeneratePackageReturn,
	})
	async findAll(
		@CurrentUser() user: UserAuth,
		@Body() filters: FilterQueueGeneratePackageDto,
	) {
		return {
			success: true,
			data: await this.queueGeneratePackageService.findAll(user, filters),
		};
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.queueGeneratePackageService.findOne(+id);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateQueueGeneratePackageDto: UpdateQueueGeneratePackageDto,
	) {
		return this.queueGeneratePackageService.update(
			+id,
			updateQueueGeneratePackageDto,
		);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.queueGeneratePackageService.remove(+id);
	}
}
