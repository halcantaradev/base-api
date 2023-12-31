import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Patch,
	Post,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { UploadFileService } from './upload-file.service';
import {
	ApiTags,
	ApiConsumes,
	ApiOperation,
	ApiResponse,
} from '@nestjs/swagger';
import { PermissionGuard } from 'src/modules/public/auth/guards/permission.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadFileDto } from './dto/upload-file.dto';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { JwtAuthGuard } from '../public/auth/guards/jwt-auth.guard';
import { RemoveFileDto } from './dto/remove-file.dto';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { UploadFileReturn } from './entities/upload-file-return.entity';

@ApiTags('Envio de Arquivos')
@Controller('uploads')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
export class UploadFileController {
	constructor(private readonly uploadFileService: UploadFileService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FilesInterceptor('files', 10))
	@ApiOperation({ summary: 'Realiza o upload de arquivo' })
	@ApiResponse({
		description: 'Upload realizado com sucesso',
		status: HttpStatus.OK,
		type: UploadFileReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao realizar o upload',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async saveFiles(
		@Body() body: UploadFileDto,
		@UploadedFiles() files: Express.Multer.File[],
		@CurrentUser() user: UserAuth,
	) {
		return {
			success: true,
			data: await this.uploadFileService.saveFiles(body, files, user.id),
			message: 'Arquivos enviados com sucesso',
		};
	}

	@Patch()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Realiza a remoção dos arquivos' })
	@ApiResponse({
		description: 'Arquivos removidos com sucesso!',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao remover os arquivos',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async removeFiles(
		@Body() body: RemoveFileDto,
		@CurrentUser() user: UserAuth,
	) {
		await this.uploadFileService.removeFiles(body.ids, user.id);

		return { success: true, message: 'Arquivos removidos com sucesso' };
	}
}
