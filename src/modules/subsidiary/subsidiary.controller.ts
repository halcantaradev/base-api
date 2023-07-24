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
} from '@nestjs/common';
import { SubsidiaryService } from './subsidiary.service';
import { CreateSubsidiaryDto } from './dto/create-subsidiary.dto';
import { UpdateSubsidiaryDto } from './dto/update-subsidiary.dto';
import { JwtAuthGuard } from '../public/auth/guards/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from '../public/auth/guards/permission.guard';
import { Role } from 'src/shared/decorators/role.decorator';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { SubsidiaryListReturn } from './entities/subsidiary-list-return.entity';
import { SubsidiaryReturn } from './entities/subsidiary-return.entity';

@ApiTags('Subsidiaries')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('subsidiaries')
export class SubsidiaryController {
	constructor(private readonly subsidiaryService: SubsidiaryService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@Role('filiais-cadastrar')
	@ApiOperation({ summary: 'Cria uma nova filial' })
	@ApiResponse({
		description: 'Filial criada com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao criar a filial',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async create(
		@CurrentUser() user: UserAuth,
		@Body() createSubsidiaryDto: CreateSubsidiaryDto,
	) {
		await this.subsidiaryService.create(user, createSubsidiaryDto);

		return { success: true, message: 'Filial criada com sucesso!' };
	}

	@Post('list')
	@HttpCode(HttpStatus.OK)
	@Role('filiais-listar')
	@ApiOperation({ summary: 'Lista todas as filiais' })
	@ApiResponse({
		description: 'Filiais listadas com sucesso',
		status: HttpStatus.OK,
		type: SubsidiaryListReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar as filiais',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findAll(@CurrentUser() user: UserAuth) {
		return {
			success: true,
			data: await this.subsidiaryService.findAll(user),
		};
	}

	@Get(':id')
	@Role('filiais-exibir-dados')
	@ApiOperation({ summary: 'Lista os dados de uma filiais' })
	@ApiResponse({
		description: 'Filial listado com sucesso',
		status: HttpStatus.OK,
		type: SubsidiaryReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os dados da filial',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findOne(@Param('id') id: string, @CurrentUser() user: UserAuth) {
		return {
			success: true,
			data: await this.subsidiaryService.findOne(+id, user),
		};
	}

	@Patch(':id')
	@Role('filiais-atualizar-dados')
	@ApiOperation({ summary: 'Atualiza os dados de uma filial' })
	@ApiResponse({
		description: 'Departamento atualizado com sucesso',
		status: HttpStatus.OK,
		type: SubsidiaryReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao atualizar a filial',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async update(
		@Param('id') id: string,
		@CurrentUser() user: UserAuth,
		@Body() updateSubsidiaryDto: UpdateSubsidiaryDto,
	) {
		return {
			success: true,
			message: 'Filial atualizada com sucesso!',
			data: await this.subsidiaryService.update(
				+id,
				user,
				updateSubsidiaryDto,
			),
		};
	}
}
