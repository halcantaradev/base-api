import {
	Body,
	Controller,
	Get,
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
import { FiltersProtocolDocumentHistoryDto } from './dto/filters-protocol-document-history.dto';

@ApiTags('Historicos')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('histories')
export class HistoryController {
	constructor(private readonly historyService: HistoryService) {}

	@Get('protocol-documents/situations')
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
	async findAllProtocolDocumentHistorySituation() {
		const data =
			await this.historyService.findAllProtocolDocumentHistorySituations();

		return {
			success: true,
			data,
		};
	}

	@Post('protocol-documents/:id')
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
	async findAllProtocolDocumentHistory(
		@Param('id') document_id: number,
		@Body()
		filtersProtocolDocumentHistoryDto: FiltersProtocolDocumentHistoryDto,
	) {
		const data = await this.historyService.findAllProtocolDocumentHistory(
			document_id,
			filtersProtocolDocumentHistoryDto,
		);

		return {
			success: true,
			data,
		};
	}
}
