import {
	Controller,
	Post,
	Body,
	UseGuards,
	HttpCode,
	HttpStatus,
	Delete,
	Param,
} from '@nestjs/common';
import { QueueGeneratePackageService } from './queue-generate-package.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../public/auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../public/auth/guards/permission.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { FilterQueueGeneratePackageDto } from './dto/filter-queue-generate-package.dto';
import { Role } from 'src/shared/decorators/role.decorator';
import { QueueGeneratePackageReturn } from './entities/queue-generate-package-return.entity';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { CreateQueueGeneratePackageDto } from './dto/create-queue-generate-package.dto';

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

	@Post('send-to-queue')
	@Role('fila-geracao-malotes-adicionar-documento')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Adiciona um documento na fila de geração de malotes',
	})
	@ApiResponse({
		description: 'Documento adicionado com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao adicionar o documento',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async create(
		@Body() body: CreateQueueGeneratePackageDto,
		@CurrentUser() user: UserAuth,
	) {
		await this.queueGeneratePackageService.create(body, user.empresa_id);
		return {
			success: true,
			message: 'Documento(s) foram enviados com êxito para a fila',
		};
	}

	@Delete(':id')
	@Role('fila-geracao-malotes-remover-documento')
	@ApiOperation({
		summary: 'Deleta um documento da fila de geração de malotes',
	})
	@ApiResponse({
		description: 'Documento deletado com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao deletar o documento',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async remove(@Param('id') id: string, @CurrentUser() user: UserAuth) {
		await this.queueGeneratePackageService.remove(+id, user.empresa_id);
		return {
			success: true,
			message: 'Documento deletado com sucesso',
		};
	}
}
