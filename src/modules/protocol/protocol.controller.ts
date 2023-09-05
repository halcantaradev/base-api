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
	Put,
	Query,
	Res,
	UseGuards,
	UseInterceptors,
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
import { Pagination } from 'src/shared/entities/pagination.entity';
import { Protocol } from './entities/protocol.entity';
import { Response } from 'express';
import { FiltersProtocolCondominiumDto } from './dto/filters-protocol-condominium.dto';
import { UserCondominiumsAccess } from 'src/shared/interceptors/user-condominiums-access.interceptor';
import { CurrentUserCondominiums } from 'src/shared/decorators/current-user-condominiums.decorator';
import { ProtocolCondominiumListReturn } from './entities/protocol-condominium-list-return.entity';
import { ProtocolDocumentReturn } from './entities/protocol-document-return.entity';
import { ProtocolDocumentListReturn } from './entities/protocol-document-list-return.entity';
import { AcceptDocumentProtocolDto } from './dto/accept-document-protocol.dto';
import { ReverseDocumentProtocolDto } from './dto/reverse-document-protocol.dto.ts';
import { SendEmailProtocolDto } from './dto/send-email-protocol.dto';

@ApiTags('Protocolos')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('protocols')
export class ProtocolController {
	constructor(private readonly protocolService: ProtocolService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@Role('protocolos-cadastrar')
	@ApiOperation({ summary: 'Cria um novo protocolo' })
	@ApiResponse({
		description: 'Protocolo criado com sucesso',
		status: HttpStatus.OK,
		type: ProtocolReturn,
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
	async searchBy(
		@Body() filtersProtocolDto: FiltersProtocolDto,
		@CurrentUser() user: UserAuth,
		@Query() pagination: Pagination,
	) {
		const data = await this.protocolService.findBy(
			filtersProtocolDto,
			user,
			pagination,
		);
		return {
			success: true,
			data,
		};
	}

	@Post('accept')
	@Role('protocolos-listar-documentos')
	@ApiOperation({
		summary: 'Lista os documentos de um protocolo',
	})
	@ApiResponse({
		description: 'Protocolo listado com sucesso',
		status: HttpStatus.OK,
		type: ProtocolDocumentListReturn,
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
	async findDocumentsBy(
		@Body() filtersProtocolDto: FiltersProtocolDto,
		@CurrentUser() user: UserAuth,
		@Query() pagination: Pagination,
	) {
		return {
			success: true,
			data: await this.protocolService.findByAccept(
				filtersProtocolDto,
				user,
				pagination,
			),
		};
	}

	@Post('condominiums')
	@Role('protocolos-listar-condominios')
	@UseInterceptors(UserCondominiumsAccess)
	@ApiOperation({
		summary:
			'Lista os condomínios que podem ser selecionados nos protocolos',
	})
	@ApiResponse({
		description: 'Condominios listados com sucesso',
		status: HttpStatus.OK,
		type: ProtocolCondominiumListReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os condominios',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async listCondominiums(
		@Body() filtersProtocolCondominiumDto: FiltersProtocolCondominiumDto,
		@CurrentUser() user: UserAuth,
		@CurrentUserCondominiums() condominiums: number[],
	) {
		return {
			success: true,
			data: await this.protocolService.findAllCondominiums(
				filtersProtocolCondominiumDto,
				condominiums,
				user,
			),
		};
	}

	@Get(':id')
	@Role('protocolos-exibir-dados')
	@UseInterceptors(UserCondominiumsAccess)
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
	async findOne(
		@Param('id') id: string,
		@CurrentUserCondominiums() condominiums: number[],
		@CurrentUser() user: UserAuth,
	) {
		return {
			success: true,
			data: await this.protocolService.findById(+id, user),
		};
	}

	@Get('print/:id')
	@Role('protocolos-exibir-dados')
	@ApiOperation({ summary: 'Imprimir os dados do protocolo' })
	@ApiResponse({
		description: 'Protocolo impressa com sucesso',
		status: HttpStatus.OK,
		type: () => Protocol,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao imprimir os dados do protocolo',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findOnePrint(
		@Param('id') id: string,
		@CurrentUser() user: UserAuth,
		@Res({ passthrough: true }) res: Response,
	) {
		const pdf = await this.protocolService.print(+id, user);

		res.set({
			'Content-Type': 'application/pdf',
			'Content-Disposition': 'inline;',
		});

		return pdf;
	}

	@Patch(':id')
	@Role('protocolos-atualizar-dados')
	@ApiOperation({ summary: 'Atualiza os dados de um protocolo' })
	@ApiResponse({
		description: 'Protocolo atualizado com sucesso',
		status: HttpStatus.OK,
		type: ProtocolReturn,
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

	@Post(':id/documents/accept')
	@Role('protocolos-documento-aceitar')
	@ApiOperation({ summary: 'Aceita os documentos de um protocolo' })
	@ApiResponse({
		description: 'Documentos aceitos com sucesso',
		status: HttpStatus.OK,
		type: ProtocolReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os documentos enviados',

		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao aceitar os documentos',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async acceptDocuments(
		@Param('id') id: string,
		@Body() acceptDocumentsProtocolDto: AcceptDocumentProtocolDto,
		@CurrentUser() user: UserAuth,
	) {
		return {
			success: true,
			message: 'Documento(s) aceito(s) com sucesso',
			data: await this.protocolService.acceptDocuments(
				+id,
				acceptDocumentsProtocolDto.documentos_ids,
				user,
			),
		};
	}

	@Get(':id/emails')
	@Role('protocolos-enviar-emails')
	@ApiOperation({
		summary:
			'Lista emails dos responsáveis pelo condomínio de um protocolo',
	})
	@ApiResponse({
		description: 'Emails listado com sucesso',
		status: HttpStatus.OK,
		type: ProtocolReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',

		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os emails',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findEmails(@Param('id') id: string, @CurrentUser() user: UserAuth) {
		return {
			success: true,
			data: await this.protocolService.findEmails(+id, user),
		};
	}

	@Post(':id/emails')
	@Role('protocolos-enviar-emails')
	@ApiOperation({ summary: 'Envia os emails de um protocolo' })
	@ApiResponse({
		description: 'Email do protocolo enviado com sucesso',
		status: HttpStatus.OK,
		type: ProtocolReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao enviar os emails do protocolo',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async sendEmails(
		@Param('id') id: string,
		@Body() sendEmailProtocolDto: SendEmailProtocolDto,
		@CurrentUser() user: UserAuth,
	) {
		await this.protocolService.sendMail(+id, sendEmailProtocolDto, user);

		return {
			success: true,
			message: 'Email(s) enviado(s) com sucesso!',
		};
	}

	@Post(':id/document')
	@HttpCode(HttpStatus.OK)
	@Role('protocolos-atualizar-dados')
	@ApiOperation({ summary: 'Cria um novo documento' })
	@ApiResponse({
		description: 'Documento criado com sucesso',
		status: HttpStatus.OK,
		type: ProtocolDocumentReturn,
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
		type: ProtocolDocumentListReturn,
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
		type: ProtocolDocumentReturn,
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
		type: ProtocolDocumentReturn,
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

	@Put(':id/document/reversal')
	@Role('protocolos-documento-estornar')
	@ApiOperation({ summary: 'Estorna um documento' })
	@ApiResponse({
		description: 'Documento estornado com sucesso',
		status: HttpStatus.OK,
		type: ProtocolDocumentReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao estornar o documento',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async reverseDocument(
		@Param('id') id: string,
		@Body() reverseDocumentProtocolDto: ReverseDocumentProtocolDto,
		@CurrentUser() user: UserAuth,
	) {
		return {
			success: true,
			message: 'Documentos estornado(s) com sucesso',
			data: await this.protocolService.reverseDocuments(
				+id,
				reverseDocumentProtocolDto.documentos_ids,
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
