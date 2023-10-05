import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Res,
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
import { Response } from 'express';
import { VirtualPackage } from './entities/virtual-package.entity';

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
		return this.virtualPackageService.create(
			createVirtualPackageDto,
			user.empresa_id,
		);
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
			success: false,
			data: await this.virtualPackageService.findAllPending(
				user.empresa_id,
			),
		};
	}

	@Get('print/:id')
	@Role('malotes-virtuais-exibir-dados')
	@ApiOperation({ summary: 'Imprimir os dados do protocolo' })
	@ApiResponse({
		description: 'Protocolo impressa com sucesso',
		status: HttpStatus.OK,
		type: () => VirtualPackage,
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
		const pdf = await this.virtualPackageService.findOnePrint();

		res.set({
			'Content-Type': 'application/pdf',
			'Content-Disposition': 'inline;',
		});

		return pdf;
	}

	@Patch(':id/document/:id_document')
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
	reverseDocumentoMalote(
		@Param('id') id: string,
		@Param('id_document') id_document: string,
	) {
		return this.virtualPackageService.reverseDoc(+id, +id_document);
	}
}
