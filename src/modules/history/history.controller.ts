import {
	Controller,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	UseGuards,
} from '@nestjs/common';
import { HistoryService } from './history.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../public/auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../public/auth/guards/permission.guard';
import { Role } from 'src/shared/decorators/role.decorator';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ProtocolDocumentHistoryListReturn } from './entities/protocol-document-history-list-return.entity';

@ApiTags('Historicos')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('histories')
export class HistoryController {
	constructor(private readonly historyService: HistoryService) {}

	@Post('protocol-document/:id')
	@HttpCode(HttpStatus.OK)
	@Role('protocolos-documentos-historico')
	@ApiOperation({ summary: 'Lista os registro de historico do documento' })
	@ApiResponse({
		description: 'Registros listados com sucesso',
		status: HttpStatus.OK,
		type: ProtocolDocumentHistoryListReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os registros',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findAllProtocolDocumentHistory(@Param('id') document_id: number) {
		const data = await this.historyService.findAllProtocolDocumentHistory(
			document_id,
		);

		return {
			success: true,
			data,
		};
	}
}
