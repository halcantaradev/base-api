import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	UseGuards,
	HttpCode,
	HttpStatus,
	Delete,
	Query,
} from '@nestjs/common';
import { DocumentTypeService } from './document-type.service';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from 'src/modules/public/auth/guards/permission.guard';
import { JwtAuthGuard } from 'src/modules/public/auth/guards/jwt-auth.guard';
import { Role } from 'src/shared/decorators/role.decorator';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { DocumentTypeListReturn } from './dto/document-type-list-return.entity';

@ApiTags('Tipos de documentos')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('document-type')
export class DocumentTypeController {
	constructor(private readonly documentTypeService: DocumentTypeService) {}
	@Post()
	@Role('tipos-documentos-cadastrar')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Cadastrar um tipo de documento' })
	@ApiResponse({
		description: 'Cadastrar tipos de documentos',
		status: HttpStatus.OK,
		type: ReturnEntity.success('Tipo de documento cadastrado com sucesso'),
		isArray: true,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar o tipo de documento',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error('Erro ao validar tipo de documento'),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao cadastrar tipo de documento',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error('Erro ao cadastrar tipo de documento'),
	})
	async create(@Body() createDocumentTypeDto: CreateDocumentTypeDto) {
		await this.documentTypeService.create(createDocumentTypeDto);
		return {
			success: true,
			message: 'Tipo de documento criado com sucesso',
		};
	}

	@Get('list')
	@Role('tipos-documentos-listar')
	@ApiOperation({ summary: 'Lista todos os tipos de documentos' })
	@ApiResponse({
		description: 'Tipos de documentos listados com sucesso',
		status: HttpStatus.OK,
		type: DocumentTypeListReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os tipos de documentos',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findAll(@Query('busca') busca: string) {
		return {
			success: true,
			data: await this.documentTypeService.findAll(busca),
		};
	}

	@Get('active')
	@Role('tipos-documentos-listar-ativos')
	@ApiOperation({ summary: 'Lista todos os tipos de documentos ativos' })
	@ApiResponse({
		description: 'Tipos de documentos listados com sucesso',
		status: HttpStatus.OK,
		type: DocumentTypeListReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os tipos de documentos',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findActive(@Query('busca') busca: string) {
		return {
			success: true,
			data: await this.documentTypeService.findAll(busca, true),
		};
	}

	@Get(':id')
	@Role('tipos-documentos-exibir-dados')
	@ApiOperation({ summary: 'Exibir dados de um tipo de documento' })
	@ApiResponse({
		description: 'Exibir dados de um tipo de documento',
		status: HttpStatus.OK,
		type: ReturnEntity.success('Dados do tipo de documento'),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao exibir os dados do tipo de documento',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(
			'Erro ao exibir os dados do tipo de documento',
		),
	})
	async findOne(@Param('id') id: string) {
		return {
			success: true,
			data: await this.documentTypeService.findOne(+id),
		};
	}

	@Patch(':id')
	@Role('tipos-documentos-atualizar')
	@ApiOperation({ summary: 'Atualizar um tipo de documento' })
	@ApiResponse({
		description: 'Cadastrar tipos de documentos',
		status: HttpStatus.OK,
		type: ReturnEntity.success('Tipo de documento cadastrado com sucesso'),
		isArray: true,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar o tipo de documento',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error('Erro ao validar tipo de documento'),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao atualizar tipo de documento',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error('Erro ao atualizar tipo de documento'),
	})
	async update(
		@Param('id') id: string,
		@Body() updateDocumentTypeDto: UpdateDocumentTypeDto,
	) {
		await this.documentTypeService.update(+id, updateDocumentTypeDto);
		return {
			success: true,
			message: 'Tipo de documento foi atualizado com sucesso',
		};
	}

	@Delete(':id')
	@Role('tipos-documentos-remover')
	@ApiOperation({ summary: 'Remover um tipo de documento' })
	@ApiResponse({
		description: 'Remover tipos de documentos',
		status: HttpStatus.OK,
		type: ReturnEntity.success('Tipo de documento removido com sucesso'),
		isArray: true,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar o tipo de documento',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error('Erro ao validar tipo de documento'),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao remover tipo de documento',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error('Erro ao remover tipo de documento'),
	})
	async remove(@Param('id') id: string) {
		await this.documentTypeService.remove(+id);
		return { success: true, message: 'Tipo de documento foi removido' };
	}
}
