import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	UseGuards,
	HttpStatus,
	HttpCode,
	Delete,
	Query,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { PermissionGuard } from '../public/auth/guards/permission.guard';
import { JwtAuthGuard } from '../public/auth/guards/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { DepartmentListReturn } from './entities/department-list-return.entity';
import { DepartmentReturn } from './entities/department-return.entity';
import { Role } from 'src/shared/decorators/role.decorator';
import { FiltersDepartmentDto } from './dto/filters-department.dto';

@ApiTags('Departments')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('departments')
export class DepartmentController {
	constructor(private readonly departmentService: DepartmentService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@Role('departamentos-cadastrar')
	@ApiOperation({ summary: 'Cria um novo departamento' })
	@ApiResponse({
		description: 'Departamento criado com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao criar o departamento',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async create(
		@CurrentUser() user: UserAuth,
		@Body() createDepartmentDto: CreateDepartmentDto,
	) {
		await this.departmentService.create(
			user.empresa_id,
			createDepartmentDto,
		);

		return { success: true, message: 'Departamento criado com sucesso' };
	}

	@Post('list')
	@HttpCode(HttpStatus.OK)
	@Role('departamentos-listar')
	@ApiOperation({ summary: 'Lista todos os departamentos' })
	@ApiResponse({
		description: 'Departamentos listados com sucesso',
		status: HttpStatus.OK,
		type: DepartmentListReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os departamentos',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findAll(
		@CurrentUser() user: UserAuth,
		@Body() filters: FiltersDepartmentDto,
	) {
		return {
			success: true,
			data: await this.departmentService.findAll(user, filters),
		};
	}

	@Get('active')
	@Role([
		'departamentos-listar-ativos',
		{
			role: 'usuarios-atualizar-vinculos-condominios',
			param: 'usuario_id',
			param_type: 'query',
		},
	])
	@ApiOperation({ summary: 'Lista todos os departamentos ativos' })
	@ApiResponse({
		description: 'Departamentos listados com sucesso',
		status: HttpStatus.OK,
		type: DepartmentListReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os departamentos',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findAllActive(
		@CurrentUser() user: UserAuth,
		@Query('usuario_id') usuario_id?: string,
		@Query('busca') busca?: string,
	) {
		return {
			success: true,
			data: await this.departmentService.findAll(
				user,
				{
					busca,
					ativo: true,
				},
				+usuario_id,
			),
		};
	}

	@Get(':id')
	@Role('departamentos-exibir-dados')
	@ApiOperation({ summary: 'Lista os dados de um departamentos' })
	@ApiResponse({
		description: 'Departamento listado com sucesso',
		status: HttpStatus.OK,
		type: DepartmentReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os dados do departamento',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findOne(@CurrentUser() user: UserAuth, @Param('id') id: string) {
		return {
			success: true,
			data: await this.departmentService.findOne(+id, user),
		};
	}

	@Patch(':id')
	@Role('departamentos-atualizar-dados')
	@ApiOperation({ summary: 'Atualiza os dados de um departamento' })
	@ApiResponse({
		description: 'Departamento atualizado com sucesso',
		status: HttpStatus.OK,
		type: DepartmentReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao validar os campos enviados',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao atualizar o departamento',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async update(
		@Param('id') id: string,
		@CurrentUser() user: UserAuth,
		@Body() updateDepartmentDto: UpdateDepartmentDto,
	) {
		return {
			success: true,
			message: 'Departamento atualizado com sucesso',
			data: await this.departmentService.update(
				+id,
				user,
				updateDepartmentDto,
			),
		};
	}

	@Delete(':id')
	@Role('departamentos-remover')
	@ApiOperation({ summary: 'Desativa um departamento' })
	@ApiResponse({
		description: 'Departamento desativado com sucesso',
		status: HttpStatus.OK,
		type: DepartmentReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao desativar o departamento',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async delete(@Param('id') id: string, @CurrentUser() user: UserAuth) {
		await this.departmentService.delete(+id, user);

		return {
			success: true,
			message: 'Departamento desativado com sucesso',
		};
	}
}
