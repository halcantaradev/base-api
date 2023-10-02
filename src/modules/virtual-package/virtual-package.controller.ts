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

@ApiTags('Malotes Virtuais')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('virtual-package')
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

	@Delete(':id')
	@Role('malotes-virtuais-excluir')
	@ApiOperation({ summary: 'Excluir um malote' })
	@ApiResponse({
		description: 'Malote excluido com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao excluir o malote',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	remove(@Param('id') id: string) {
		return this.virtualPackageService.remove(+id);
	}

	@Patch('document/:id')
	@Role('malotes-virtuais-documentos-estornar')
	reverseDocumentoMalote(@Param('id') id: string) {
		return this.virtualPackageService.reverseDoc(+id);
	}
}
