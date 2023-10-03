import {
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
	ApiConsumes,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Role } from 'src/shared/decorators/role.decorator';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { JwtAuthGuard } from '../public/auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../public/auth/guards/permission.guard';
import { ImportDataService } from './import-data.service';

@ApiTags('Importação')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('import-data')
export class ImportDataController {
	constructor(private readonly importDataService: ImportDataService) {}

	@Post()
	@UseInterceptors(FilesInterceptor('import', 1))
	@HttpCode(HttpStatus.OK)
	@Role('importar-dados-iniciais')
	@ApiOperation({ summary: 'Importar dados iniciais' })
	@ApiConsumes('multipart/form-data')
	@ApiResponse({
		description: 'Dados importados com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao importar os dados',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	importData(
		@UploadedFiles() file: Express.Multer.File[],
		@CurrentUser() user: UserAuth,
	) {
		return this.importDataService.importData(file[0], user.empresa_id);
	}
}
