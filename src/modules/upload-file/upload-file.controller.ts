import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
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
import { PermissionGuard } from 'src/modules/auth/guards/permission.guard';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadFileDto } from './dto/upload-file.dto';
import { ReturnEntity } from 'src/shared/entities/return.entity';

@ApiTags('Upload File')
@Controller('uploads')
@UseGuards(PermissionGuard)
@UseGuards(AuthGuard('jwt'))
export class UploadFileController {
	constructor(private readonly uploadFileService: UploadFileService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FilesInterceptor('files'))
	@ApiOperation({ summary: 'Realiza o upload de arquivo' })
	@ApiResponse({
		description: 'Upload realizado com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao realizar o upload',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async saveFiles(
		@Body() body: UploadFileDto,
		@UploadedFiles() files: Express.Multer.File[],
	) {
		await this.uploadFileService.saveFiles(
			body.reference_id,
			body.origin,
			files,
		);

		return { success: true, message: 'Arquivos enviados com sucesso' };
	}
}