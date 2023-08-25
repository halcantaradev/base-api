import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { ProtocolService } from './protocol.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../public/auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../public/auth/guards/permission.guard';
import { Role } from 'src/shared/decorators/role.decorator';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { CreateProtocolDto } from './dto/create-protocol.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { ProtocolReturn } from './entities/protocol-return.entity';
import { UpdateProtocolDto } from './dto/update-protocol.dto';
import { FiltersProtocolDto } from './dto/filters-protocol.dto';
import { ProtocolListReturn } from './entities/protocol-list-return.entity';
import { CreateDocumentProtocolDto } from './dto/create-document-protocol.dto';
import { UpdateDocumentProtocolDto } from './dto/update-document-protocol.dto';

@ApiTags('Protocolos')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('protocol')
export class ProtocolController {
	constructor(private readonly protocolService: ProtocolService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@Role('protocolos-cadastrar')
	@ApiOperation({ summary: 'Cria um novo protocolo' })
	@ApiResponse({
		description: 'Protocolo criado com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao criar o protocolo',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async create(
		@Body() createProtocolDto: CreateProtocolDto,
		@CurrentUser() user: UserAuth,
	) {
		return {
			success: true,
			data: await this.protocolService.create(createProtocolDto, user),
		};
	}

	@Post('list')
	@Role('protocolos-listar')
	@ApiOperation({ summary: 'Lista os protocolos' })
	@ApiResponse({
		description: 'Protocolos listados com sucesso',
		status: HttpStatus.OK,
		type: ProtocolListReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os protocolos',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findAll(
		@Body() filtersProtocolDto: FiltersProtocolDto,
		@CurrentUser() user: UserAuth,
	) {
		return {
			success: true,
			data: await this.protocolService.findAll(filtersProtocolDto, user),
		};
	}

	@Get(':id')
	@Role('protocolos-exibir-dados')
	@ApiOperation({ summary: 'Lista os dados de um protocolo' })
	@ApiResponse({
		description: 'Protocolo listado com sucesso',
		status: HttpStatus.OK,
		type: ProtocolReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar o protocolo',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findOne(@Param('id') id: string, @CurrentUser() user: UserAuth) {
		return {
			success: true,
			data: await this.protocolService.findById(+id, user),
		};
	}

	@Patch(':id')
	@Role('protocolos-atualizar-dados')
	@ApiOperation({ summary: 'Atualiza os dados de um protocolo' })
	@ApiResponse({
		description: 'Protocolo atualizado com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao atualizar o protocolo',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async update(
		@Param('id') id: string,
		@Body() updateProtocolDto: UpdateProtocolDto,
		@CurrentUser() user: UserAuth,
	) {
		return {
			success: true,
			message: 'Protocolo atualizado com sucesso',
			data: await this.protocolService.update(
				+id,
				updateProtocolDto,
				user,
			),
		};
	}

	@Post(':id/document')
	@HttpCode(HttpStatus.OK)
	@Role('protocolos-atualizar-dados')
	@ApiOperation({ summary: 'Cria um novo documento' })
	@ApiResponse({
		description: 'Documento criado com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao criar o documento',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async createDocument(
		@Param('id') id: string,
		@Body() createDocumentProtocolDto: CreateDocumentProtocolDto,
		@CurrentUser() user: UserAuth,
	) {
		return {
			success: true,
			message: 'Documento adicionado com sucesso',
			data: await this.protocolService.createDocument(
				+id,
				createDocumentProtocolDto,
				user,
			),
		};
	}

	@Get(':id/document')
	@Role('protocolos-exibir-dados')
	@ApiOperation({ summary: 'Lista os documentos de um protocolo' })
	@ApiResponse({
		description: 'Documentos listado com sucesso',
		status: HttpStatus.OK,
		type: ProtocolReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os documentos',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findAllDocuments(
		@Param('id') id: string,
		@CurrentUser() user: UserAuth,
	) {
		return {
			success: true,
			data: await this.protocolService.findAllDocuments(+id, user),
		};
	}

	@Get(':id/document/:document_id')
	@Role('protocolos-exibir-dados')
	@ApiOperation({ summary: 'Lista os documentos de um protocolo' })
	@ApiResponse({
		description: 'Documentos listado com sucesso',
		status: HttpStatus.OK,
		type: ProtocolReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os documentos',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findOneDocument(
		@Param('id') id: string,
		@Param('document_id') document_id: string,
		@CurrentUser() user: UserAuth,
	) {
		return {
			success: true,
			data: await this.protocolService.findDocumentById(
				+id,
				+document_id,
				user,
			),
		};
	}

	@Patch(':id/document/:document_id')
	@Role('protocolos-atualizar-dados')
	@ApiOperation({ summary: 'Atualiza os dados de um documento' })
	@ApiResponse({
		description: 'Documento atualizado com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao atualizar o documento',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async updateDocument(
		@Param('id') id: string,
		@Param('document_id') document_id: string,
		@Body() updateDocumentProtocolDto: UpdateDocumentProtocolDto,
		@CurrentUser() user: UserAuth,
	) {
		return {
			success: true,
			message: 'Documento atualizado com sucesso',
			data: await this.protocolService.updateDocument(
				+id,
				+document_id,
				updateDocumentProtocolDto,
				user,
			),
		};
	}

	@Delete(':id/document/:document_id')
	@Role('protocolos-atualizar-dados')
	@ApiOperation({ summary: 'Deleta um documento' })
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
	async deleteDocument(
		@Param('id') id: string,
		@Param('document_id') document_id: string,
		@CurrentUser() user: UserAuth,
	) {
		await this.protocolService.updateDocument(
			+id,
			+document_id,
			{},
			user,
			true,
		);

		return {
			success: true,
			message: 'Documento deletado com sucesso',
		};
	}
}
