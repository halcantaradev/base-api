import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../public/auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../public/auth/guards/permission.guard';
import { CreateVirtualPackageDto } from './dto/create-virtual-package.dto';
import { VirtualPackageService } from './virtual-package.service';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { VirtualPackageListReturn } from './entities/virtual-package-return.entity';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { Role } from 'src/shared/decorators/role.decorator';
import { SetupVirtualPackageListReturn } from './entities/setup-virtual-package-return.entity';
import { PhysicalPackageVirtualPackageListReturn } from './entities/physical-package-virtual-package-return.entity';
import { CreateNewDocumentVirtualPackageDto } from './dto/create-new-document-virtual-package.dto';
import { UpdateNewDocumentVirtualPackageDto } from './dto/update-new-document-virtual-package.dto';
import { NewDocumentVirtualPackageListReturn } from './entities/new-document-virtual-package-return.entity';

@ApiTags('Malotes Virtuais')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('virtual-packages')
export class VirtualPackageController {
	constructor(
		private readonly virtualPackageService: VirtualPackageService,
	) {}

	@Post()
	@Role('malotes-virtuais-gerar')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Gerar malote virtual' })
	@ApiResponse({
		description: 'Malote gerado com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao gerar o malote',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	create(
		@CurrentUser() user: UserAuth,
		@Body() createVirtualPackageDto: CreateVirtualPackageDto,
	) {
		return this.virtualPackageService.create(createVirtualPackageDto, user);
	}

	@Get('physical-packages')
	@Role('malotes-virtuais-gerar')
	@ApiOperation({ summary: 'Lista todos os malotes físicos disponíveis' })
	@ApiResponse({
		description: 'Malotes físicos listados com sucesso',
		status: HttpStatus.OK,
		type: PhysicalPackageVirtualPackageListReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os malotes físicos',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os malotes físicos',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	async findAll(@CurrentUser() user: UserAuth) {
		const data = await this.virtualPackageService.findAllPhysicalPackage(
			user.empresa_id,
		);

		return {
			success: true,
			data,
		};
	}

	@Get(':id')
	@Role('malotes-virtuais-exibir-dados')
	@ApiOperation({
		summary: 'Lista os dados do malote virtual',
	})
	@ApiResponse({
		description: 'Dados listados com sucesso',
		status: HttpStatus.OK,
		type: VirtualPackageListReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os dados',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findOne(@CurrentUser() user: UserAuth, @Param('id') id: string) {
		return {
			dados: await this.virtualPackageService.findById(
				user.empresa_id,
				+id,
			),
			success: true,
		};
	}

	@Get('setup')
	@Role('malotes-virtuais-gerar')
	@ApiOperation({
		summary: 'Lista todos os dados de setup de malotes da empresa',
	})
	@ApiResponse({
		description: 'Dados listados com sucesso',
		status: HttpStatus.OK,
		type: SetupVirtualPackageListReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os dados',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findSetupData(@CurrentUser() user: UserAuth) {
		const data = await this.virtualPackageService.findSetupData(
			user.empresa_id,
		);

		return {
			success: true,
			data,
		};
	}

	@Get('pending')
	@Role('malotes-virtuais-listar-pendentes')
	@ApiOperation({ summary: 'Lista todos os malotes pendentes' })
	@ApiResponse({
		description: 'Malotes listados com sucesso',
		status: HttpStatus.OK,
		type: VirtualPackageListReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os malotes',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findAllPending(@CurrentUser() user: UserAuth) {
		return {
			success: true,
			data: await this.virtualPackageService.findAllPending(
				user.empresa_id,
			),
		};
	}

	@Post(':id/receive/:id_document')
	@HttpCode(HttpStatus.OK)
	@Role('malotes-virtuais-baixar')
	@ApiOperation({ summary: 'Realiza a baixa do malote' })
	@ApiResponse({
		description: 'Malotes recebido com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao baixar o malote',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async receiveDoc(
		@CurrentUser() user: UserAuth,
		@Param('id') id: string,
		@Param('id_document') id_document: string,
	) {
		await this.virtualPackageService.receiveDoc(
			+id,
			+id_document,
			user.empresa_id,
		);

		return { success: true, message: 'Documento baixado com sucesso!' };
	}

	@Patch(':id/receive/:id_document/reverse')
	@Role('malotes-virtuais-documentos-estornar-recebimento')
	@ApiOperation({
		summary: 'Estorna a baixa de um documento do malote',
	})
	@ApiResponse({
		description: 'Baixa estornada com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao estornar a baixa do documento',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async reverseReceiveDoc(
		@CurrentUser() user: UserAuth,
		@Param('id') id: string,
		@Param('id_document') id_document: string,
	) {
		await this.virtualPackageService.reverseDoc(
			+id,
			+id_document,
			user.empresa_id,
		);

		return { success: true, message: 'Baixa estornada com sucesso!' };
	}

	@Post(':id/new-documents')
	@HttpCode(HttpStatus.OK)
	@Role('malotes-virtuais-baixar')
	@ApiOperation({ summary: 'Adiciona um novo documento na baixa do malote' })
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
	async createNewDoc(
		@CurrentUser() user: UserAuth,
		@Param('id') id: string,
		@Body()
		createNewDocumentVirtualPackageDto: CreateNewDocumentVirtualPackageDto,
	) {
		await this.virtualPackageService.createNewDoc(
			+id,
			createNewDocumentVirtualPackageDto,
			user,
		);

		return { success: true, message: 'Documento salvo com sucesso!' };
	}

	@Get(':id/new-documents')
	@Role('malotes-virtuais-baixar')
	@ApiOperation({ summary: 'Adiciona um novo documento na baixa do malote' })
	@ApiResponse({
		description: 'Documento adicionado com sucesso',
		status: HttpStatus.OK,
		type: NewDocumentVirtualPackageListReturn,
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
	async findAllNewDocs(
		@CurrentUser() user: UserAuth,
		@Param('id') id: string,
	) {
		return {
			success: true,
			data: await this.virtualPackageService.findAllNewDocs(
				+id,
				user.empresa_id,
			),
		};
	}

	@Patch(':id/new-documents/:id_document')
	@Role('malotes-virtuais-baixar')
	@ApiOperation({
		summary: 'Atualiza um documento adicionado na baixa do malote',
	})
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
	async updateNewDoc(
		@CurrentUser() user: UserAuth,
		@Param('id') id: string,
		@Param('id_document') id_document: string,
		@Body()
		updateNewDocumentVirtualPackageDto: UpdateNewDocumentVirtualPackageDto,
	) {
		await this.virtualPackageService.updateNewDoc(
			+id,
			+id_document,
			updateNewDocumentVirtualPackageDto,
			user,
		);

		return { success: true, message: 'Documento atualizado com sucesso!' };
	}

	@Post(':id/new-documents/finalize')
	@HttpCode(HttpStatus.OK)
	@Role('malotes-virtuais-baixar')
	@ApiOperation({
		summary:
			'Finaliza os novos documentos dentro de um protocolo na baixa do malote',
	})
	@ApiResponse({
		description: 'Documento salvos com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao salvar os documentos',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async finalizeNewDoc(
		@CurrentUser() user: UserAuth,
		@Param('id') id: string,
	) {
		await this.virtualPackageService.finalizeNewDocs(+id, user);

		return { success: true, message: 'Documentos salvos com sucesso!' };
	}

	@Patch(':id/document/:id_document/reverse')
	@Role('malotes-virtuais-documentos-estornar')
	@ApiOperation({ summary: 'Estorna um documento do malote' })
	@ApiResponse({
		description: 'Documento do malote estornado com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao estornar o documento do malote',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async reverseDoc(
		@CurrentUser() user: UserAuth,
		@Param('id') id: string,
		@Param('id_document') id_document: string,
	) {
		await this.virtualPackageService.reverseDoc(
			+id,
			+id_document,
			user.empresa_id,
		);

		return { success: true, message: 'Documento estornado com sucesso!' };
	}
}
function user(
	target: VirtualPackageController,
	propertyKey: 'findOne',
	parameterIndex: 0,
): void {
	throw new Error('Function not implemented.');
}
