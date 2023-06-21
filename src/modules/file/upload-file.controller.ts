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

@ApiTags('Files')
@Controller('files')
@UseGuards(PermissionGuard)
@UseGuards(AuthGuard('jwt'))
export class UploadFileController {
	constructor(private readonly uploadFileService: UploadFileService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FilesInterceptor('files'))
	@ApiOperation({ summary: 'Realiza a autênticação do usuário' })
	@ApiResponse({
		description: 'Usuário autenticado com sucesso',
		status: HttpStatus.OK,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao realizar o login',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	saveFiles(
		@Body() body: UploadFileDto,
		@UploadedFiles() files: Express.Multer.File[],
	) {
		return this.uploadFileService.saveFiles(
			body.reference_id,
			body.origin,
			files,
		);
	}
}
