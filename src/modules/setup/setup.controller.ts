import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Patch,
	UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Role } from 'src/shared/decorators/role.decorator';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { JwtAuthGuard } from '../public/auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../public/auth/guards/permission.guard';
import { UpdateSetupCompanyThemeDto } from './dto/update-setup-company-theme.dto';
import { UpdateSetupCompanyDto } from './dto/update-setup-company.dto';
import { SetupCompanyReturn } from './entities/setup-company-return.entity';
import { SetupCompanyThemeReturn } from './entities/setup-company-theme-return.entity';
import { SetupService } from './setup.service';

@ApiTags('Módulo de Configurações')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('setup')
export class SetupController {
	constructor(private readonly setupService: SetupService) {}

	@Get('company')
	@Role('setup-empresa-exibir-dados')
	@ApiOperation({ summary: 'Lista os dados de uma empresa' })
	@ApiResponse({
		description: 'Empresa listada com sucesso',
		status: HttpStatus.OK,
		type: SetupCompanyReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os dados da empresa',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findOneCompany(@CurrentUser() user: UserAuth) {
		return {
			success: true,
			data: await this.setupService.findOneCompany(user.empresa_id),
		};
	}

	@Patch('company')
	@Role('setup-empresa-atualizar')
	@ApiOperation({ summary: 'Atualiza os dados de uma empresa' })
	@ApiResponse({
		description: 'Empresa atualizada com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao atualizar os dados da empresa',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async updateCompany(
		@CurrentUser() user: UserAuth,
		@Body() updateSetupCompanyDto: UpdateSetupCompanyDto,
	) {
		await this.setupService.updateCompany(
			updateSetupCompanyDto,
			user.empresa_id,
		);

		return {
			success: true,
			message: 'Empresa atualizada com sucesso!',
		};
	}

	@Get('company/themes')
	@Role('setup-empresa-atualizar')
	@ApiOperation({ summary: 'Retorna os dados do tema da empresa' })
	@ApiResponse({
		description: 'Tema retornado com sucesso',
		status: HttpStatus.OK,
		type: SetupCompanyThemeReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao retornar os dados do tema da empresa',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findCompanyTheme(@CurrentUser() user: UserAuth) {
		return {
			success: true,
			data: await this.setupService.findCompanyTheme(user.empresa_id),
		};
	}

	@Patch('company/themes')
	@Role('setup-empresa-atualizar')
	@ApiOperation({ summary: 'Atualiza o tema da empresa' })
	@ApiResponse({
		description: 'Tema atualizado com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao atualizar o tema da empresa',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async updateCompanyTheme(
		@CurrentUser() user: UserAuth,
		@Body() updateSetupCompanyThemeDto: UpdateSetupCompanyThemeDto,
	) {
		await this.setupService.updateCompanyTheme(
			updateSetupCompanyThemeDto,
			user.empresa_id,
		);

		return {
			success: true,
			message: 'Logo atualizada com sucesso!',
		};
	}
}
