import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Param,
	Patch,
	UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Role } from 'src/shared/decorators/role.decorator';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { JwtAuthGuard } from '../public/auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../public/auth/guards/permission.guard';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyReturn } from './entities/company-return.entity';

@ApiTags('Empresa')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompanyController {
	constructor(private readonly companyService: CompanyService) {}

	@Get(':id')
	@Role('empresa-exibir-dados')
	@ApiOperation({ summary: 'Lista os dados de uma empresa' })
	@ApiResponse({
		description: 'Empresa listada com sucesso',
		status: HttpStatus.OK,
		type: CompanyReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os dados da empresa',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findOne(@CurrentUser() user: UserAuth, @Param('id') id: string) {
		return {
			success: true,
			data: await this.companyService.findOne(+id, user.empresa_id),
		};
	}

	@Patch(':id')
	@Role('empresa-atualizar')
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
	async update(
		@CurrentUser() user: UserAuth,
		@Body() updateCompanyDto: UpdateCompanyDto,
		@Param('id') id: string,
	) {
		await this.companyService.update({
			id: +id,
			updateCompanyDto,
			empresa_id: user.empresa_id,
		});

		return {
			success: true,
			message: 'Condomínio atualizado com sucesso!',
		};
	}
}
