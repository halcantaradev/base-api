import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	HttpStatus,
	HttpCode,
	UseGuards,
	Query,
} from '@nestjs/common';
import { PhysicalPackageService } from './physical-package.service';
import { CreatePhysicalPackageDto } from './dto/create-physical-package.dto';
import { UpdatePhysicalPackageDto } from './dto/update-physical-package.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { Role } from 'src/shared/decorators/role.decorator';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { JwtAuthGuard } from '../public/auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../public/auth/guards/permission.guard';
import { FiltersPhysicalPackage } from './dto/filters-physical-package.dto';

@ApiTags('Malotes físicos')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('physical-package')
export class PhysicalPackageController {
	constructor(
		private readonly physicalPackageService: PhysicalPackageService,
	) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@Role('malote-fisico-cadastrar')
	@ApiOperation({ summary: 'Cria um novo malote físico' })
	@ApiResponse({
		description: 'Malote físico criado com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao criar o malote físico',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	create(
		@CurrentUser() user: UserAuth,
		@Body() createPhysicalPackageDto: CreatePhysicalPackageDto,
	) {
		return this.physicalPackageService.create(
			user.empresa_id,
			createPhysicalPackageDto,
		);
	}

	@Post('list')
	@Role('malote-fisico-listar')
	async findAll(
		@CurrentUser() user: UserAuth,
		@Body() filters: FiltersPhysicalPackage,
		@Query('page') page: number,
	) {
		const data = await this.physicalPackageService.findAll(
			user.empresa_id,
			filters,
			+page,
		);
		return {
			success: true,
			data,
		};
	}

	@Get(':id')
	@Role('malote-fisico-exibir-dados')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Busca um malote físico pelo ID' })
	@ApiResponse({
		description: 'Malote físico encontrado com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Malote físico não encontrado',
		status: HttpStatus.NOT_FOUND,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao buscar o malote físico',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findOne(@Param('id') id: string) {
		return {
			success: true,
			data: await this.physicalPackageService.findOne(+id),
		};
	}

	@Patch(':id')
	@Role('malote-fisico-atualizar')
	@ApiOperation({ summary: 'Atualiza os dados de um malote físico' })
	@ApiResponse({
		description: 'Malote físico atualizado com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao atualizar o malote físico',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	update(
		@Param('id') id: string,
		@Body() updatePhysicalPackageDto: UpdatePhysicalPackageDto,
	) {
		return this.physicalPackageService.update(
			+id,
			updatePhysicalPackageDto,
		);
	}

	@Delete(':id')
	@Role('malote-fisico-excluir')
	@ApiOperation({ summary: 'Exclui um malote físico' })
	@ApiResponse({
		description: 'Malote físico excluído com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao excluir o malote físico',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Malote físico não encontrado',
		status: HttpStatus.NOT_FOUND,
		type: ReturnEntity.error(),
	})
	remove(@Param('id') id: string) {
		return this.physicalPackageService.remove(+id);
	}
}
