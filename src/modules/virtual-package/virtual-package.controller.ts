import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Role } from 'src/shared/decorators/role.decorator';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { JwtAuthGuard } from '../public/auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../public/auth/guards/permission.guard';
import { CreateNewDocumentVirtualPackageDto } from './dto/create-new-document-virtual-package.dto';
import { CreateVirtualPackageDto } from './dto/create-virtual-package.dto';
import { FiltersVirtualPackageDto } from './dto/filters-virtual-package.dto';
import { UpdateNewDocumentVirtualPackageDto } from './dto/update-new-document-virtual-package.dto';
import { NewDocumentVirtualPackageListReturn } from './entities/new-document-virtual-package-return.entity';
import { ReceiveVirtualPackageDto } from './dto/receive-virtual-package.dto';
import { ReverseReceiveVirtualPackageDto } from './dto/reverse-receive-virtual-package.dto';
import { PhysicalPackageVirtualPackageListReturn } from './entities/physical-package-virtual-package-return.entity';
import { SetupVirtualPackageListReturn } from './entities/setup-virtual-package-return.entity';
import { VirtualPackageReportReturnEntity } from './entities/virtual-package-report-return.entity';
import { VirtualPackageListReturn } from './entities/virtual-package-return.entity';
import { VirtualPackageService } from './virtual-package.service';
import { ReverseVirtualPackageDto } from './dto/reverse-virtual-package.dto';
import { FiltersSearchVirtualPackageDto } from './dto/filters-search-virtual-package.dto';
import { Pagination } from 'src/shared/entities/pagination.entity';
import { ReceivePackageVirtualPackageDto } from './dto/receive-package-virtual-package.dto';
import { CreateProtocolVirtualPackageDto } from './dto/create-protocol-virtual-package.dto';

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

	@Post('pending')
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
	async findAllPending(
		@CurrentUser() user: UserAuth,
		@Body() filters: FiltersSearchVirtualPackageDto,
		@Query() pagination: Pagination,
	) {
		return this.virtualPackageService.findAllPending(
			user.empresa_id,
			filters,
			pagination,
		);
	}

	@Post('report')
	@Role('malote-virtual-relatorio')
	@ApiOperation({ summary: 'Imprimir relatório do malote gerado' })
	@ApiResponse({
		description: 'Dados de malotes listados com sucesso',
		status: HttpStatus.OK,
		type: VirtualPackageReportReturnEntity,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os dados',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os dados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	async findOnePrint(
		@CurrentUser() user: UserAuth,
		@Body() filters: FiltersVirtualPackageDto,
	) {
		const data = await this.virtualPackageService.findBy(
			user.empresa_id,
			filters,
		);

		return {
			success: true,
			data,
		};
	}

	@Post('receive-package')
	@HttpCode(HttpStatus.OK)
	@Role('malotes-virtuais-baixar')
	@ApiOperation({ summary: 'Realiza o recebimento do malote' })
	@ApiResponse({
		description: 'Malotes recebido com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao receber o malote',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao receber o malote',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async receivePackageDoc(
		@CurrentUser() user: UserAuth,
		@Body()
		receivePackageVirtualPackageDto: ReceivePackageVirtualPackageDto,
	) {
		await this.virtualPackageService.receivePackageDoc(
			receivePackageVirtualPackageDto,
			user.empresa_id,
		);

		return { success: true, message: 'Malote(s) recebido(s) com sucesso' };
	}

	@Post('protocol')
	@HttpCode(HttpStatus.OK)
	@Role('protocolos-cadastrar')
	@ApiOperation({ summary: 'Cria um protocolo de malotes' })
	@ApiResponse({
		description: 'Protocolo criado com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao criar o protocolo',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao criar o protocolo',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async createPackageProtocol(
		@CurrentUser() user: UserAuth,
		@Body()
		createProtocolVirtualPackageDto: CreateProtocolVirtualPackageDto,
	) {
		await this.virtualPackageService.createPackageProtocol(
			createProtocolVirtualPackageDto,
			user,
		);

		return { success: true, message: 'Protocolo criado com sucesso' };
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
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os dados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	async findOne(@CurrentUser() user: UserAuth, @Param('id') id: string) {
		return {
			data: await this.virtualPackageService.findById(
				user.empresa_id,
				+id,
			),
			success: true,
		};
	}

	@Get(':id/documents')
	@Role('malotes-virtuais-listar-documentos')
	@ApiOperation({
		summary: 'Lista os documentos do malote virtual',
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
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os dados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	async listDocuments(
		@CurrentUser() user: UserAuth,
		@Param('id') id: string,
		@Query() pagination: Pagination,
	) {
		const dados = await this.virtualPackageService.findDocs(
			user.empresa_id,
			+id,
			pagination,
		);
		return {
			sucess: true,
			...dados,
		};
	}

	@Patch(':id/reverse')
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
		@Body() reverseVirtualPackageDto: ReverseVirtualPackageDto,
	) {
		await this.virtualPackageService.reverseDoc(
			+id,
			reverseVirtualPackageDto,
			user.empresa_id,
		);

		return { success: true, message: 'Documento excluído com sucesso!' };
	}

	@Post(':id/receive')
	@HttpCode(HttpStatus.OK)
	@Role('malotes-virtuais-baixar')
	@ApiOperation({ summary: 'Realiza a baixa do malote' })
	@ApiResponse({
		description: 'Malotes baixado com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao baixar o malote',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao baixar o malote',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async receiveDoc(
		@CurrentUser() user: UserAuth,
		@Param('id') id: string,
		@Body() receiveVirtualPackageDto: ReceiveVirtualPackageDto,
	) {
		return this.virtualPackageService.receiveDoc(
			+id,
			receiveVirtualPackageDto,
			user.empresa_id,
		);
	}

	@Patch(':id/receive/reverse')
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
		@Body()
		reverseReceiveVirtualPackageDto: ReverseReceiveVirtualPackageDto,
	) {
		await this.virtualPackageService.reverseReceiveDoc(
			+id,
			reverseReceiveVirtualPackageDto,
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
}
