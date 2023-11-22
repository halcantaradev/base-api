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
	Query,
	UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Role } from 'src/shared/decorators/role.decorator';
import { Pagination } from 'src/shared/entities/pagination.entity';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { JwtAuthGuard } from '../public/auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../public/auth/guards/permission.guard';
import { CreateProtocolVirtualPackageDto } from './dto/create-new-protocol-virtual-package.dto';
import { CreateVirtualPackageDto } from './dto/create-virtual-package.dto';
import { FiltersSearchVirtualPackageDto } from './dto/filters-search-virtual-package.dto';
import { FiltersVirtualPackageDto } from './dto/filters-virtual-package.dto';
import { ReceivePackageVirtualPackageDto } from './dto/receive-package-virtual-package.dto';
import { ReceiveVirtualPackageDto } from './dto/receive-virtual-package.dto';
import { ReverseReceiveVirtualPackageDto } from './dto/reverse-receive-virtual-package.dto';
import { ReverseVirtualPackageDto } from './dto/reverse-virtual-package.dto';
import { NewDocumentVirtualPackageListReturn } from './entities/new-document-virtual-package-return.entity';
import { PhysicalPackageVirtualPackageListReturn } from './entities/physical-package-virtual-package-return.entity';
import { SetupVirtualPackageListReturn } from './entities/setup-virtual-package-return.entity';
import { VirtualPackageReportReturnEntity } from './entities/virtual-package-report-return.entity';
import { VirtualPackageListReturn } from './entities/virtual-package-return.entity';
import { VirtualPackageService } from './virtual-package.service';
import { CreateNewDocumenteProtocolVirtualPackageDto } from './dto/create-new-document-protocol-virtual-package.dto';
import { ValidateSealVirtualPackageListReturn } from './entities/validate-seal-virtual-package-return.entity';

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
	async create(
		@CurrentUser() user: UserAuth,
		@Body() createVirtualPackageDto: CreateVirtualPackageDto,
	) {
		await this.virtualPackageService.create(createVirtualPackageDto, user);

		return { success: true, message: 'Malote gerado com successo!' };
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

	@Get('validate-seal')
	@Role('malotes-virtuais-gerar')
	@ApiOperation({ summary: 'Valida se o lacre informado foi utilizado' })
	@ApiResponse({
		description: 'Lacre validado com sucesso',
		status: HttpStatus.OK,
		type: ValidateSealVirtualPackageListReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar o lacre',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar o lacre',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	async validateSeal(@Query('lacre') seal: string) {
		const data = await this.virtualPackageService.validateSeal(seal);

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
		const data = await this.virtualPackageService.report(user, filters);

		return {
			success: true,
			data,
		};
	}

	@Post('receive-package')
	@HttpCode(HttpStatus.OK)
	@Role('malotes-virtuais-baixar')
	@ApiOperation({ summary: 'Marca o malote como retornado' })
	@ApiResponse({
		description: 'Retornado com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao marcar o malote como retornado',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao marcar o malote como retornado',
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

		return {
			success: true,
			message: 'Malote(s) macado(s como retronado(s) com sucesso',
		};
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

	@Patch(':id/make-physical-package-avaliable')
	@Role('malotes-fisico-liberar')
	@ApiOperation({
		summary: 'Libera um malote para uso no sistema',
	})
	@ApiResponse({
		description: 'Malote liberado com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao liberar o malote',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao liberar o malote',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	async makePhysicalPackageAvailable(
		@CurrentUser() user: UserAuth,
		@Param('id') id: string,
	) {
		await this.virtualPackageService.makePhysicalPackageAvailable(
			user.empresa_id,
			+id,
		);
		return {
			success: true,
			message: 'Malote liberado com sucesso!',
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
			user,
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
		await this.virtualPackageService.receiveDoc(
			+id,
			receiveVirtualPackageDto,
			user,
		);

		return {
			success: true,
			message: 'Documento(s) baixado(s) com sucesso!',
		};
	}

	@Patch(':id/receive/reverse')
	@Role('malotes-virtuais-documentos-estornar-retorno')
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
			user,
		);

		return {
			success: true,
			message: 'Baixa(s) ou Não recebimento estornado(s) com sucesso!',
		};
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
		createNewDocumentVirtualPackageDto: CreateNewDocumenteProtocolVirtualPackageDto,
	) {
		return {
			success: true,
			message: 'Documento salvo com sucesso!',
			data: await this.virtualPackageService.createNewDoc(
				+id,
				createNewDocumentVirtualPackageDto,
				user,
			),
		};
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

	@Delete(':id/new-documents/:id_document')
	@Role('malotes-virtuais-baixar')
	@ApiOperation({
		summary: 'Remove um documento adicionado na baixa do malote',
	})
	@ApiResponse({
		description: 'Documento removido com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao remover o documento',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async updateNewDoc(
		@CurrentUser() user: UserAuth,
		@Param('id') id: string,
		@Param('id_document') id_document: string,
	) {
		await this.virtualPackageService.removeNewDoc(+id, +id_document, user);

		return { success: true, message: 'Documento removido com sucesso!' };
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
