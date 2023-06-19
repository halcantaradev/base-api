import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Put,
	UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from 'src/modules/auth/guards/permission.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePermissionsDto } from './dto/create-permission.dto';
import { ValidPermissionDTO } from './dto/valid-permission.dto';
import { PermissionReturn } from './entities/permission-return.entity';
import { PermissionsService } from './permissions.service';
@ApiTags('Permissions')
@UseGuards(JwtAuthGuard)
@UseGuards(PermissionGuard)
@Controller('permissions')
export class PermissionsController {
	constructor(private readonly permissionsService: PermissionsService) {}

	@Post('check')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Checar permissão' })
	@ApiResponse({
		description: 'Permissão checada com sucesso',
		status: HttpStatus.OK,
		type: PermissionReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao checar a permissão',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error('Permissão não encontrada'),
	})
	async checkAcesse(
		@Body() validPermission: ValidPermissionDTO,
		@CurrentUser() user: UserAuth,
	) {
		const permission = await this.permissionsService.checkAcess({
			user_id: user.id,
			cargo_id: user.cargo_id,
			action: validPermission.action,
		});

		if (!permission) {
			throw new BadRequestException('Permissão não encontrada');
		}

		return permission;
	}

	@Put('cargo/:id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Conceder permissões ao cargo' })
	@ApiResponse({
		description: 'Permissões concedidas com sucesso',
		status: HttpStatus.OK,
		type: () => ReturnEntity.success('Permissões concedidas com sucesso'),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao conceder as permissões',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error('Ocorreu um erro ao conceder as permissões'),
	})
	@ApiResponse({
		description: 'Validação dos campos',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error('Verifique os campos'),
	})
	async givePermissionToOcupation(
		@Body() permissionDTO: CreatePermissionsDto,
		@CurrentUser() user: UserAuth,
		@Param('id') id: string,
	) {
		await this.permissionsService.givePermissionToOcupation(
			permissionDTO,
			user.empresa_id,
			+id,
		);

		return { success: true, message: 'Permissões concedidas com sucesso' };
	}

	@Put('user/:id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Conceder permissões ao usuário' })
	@ApiResponse({
		description: 'Permissões concedidas com sucesso',
		status: HttpStatus.OK,
		type: ReturnEntity.success('Permissões concedidas com sucesso'),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao conceder as permissões',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error('Ocorreu um erro ao conceder as permissões'),
	})
	@ApiResponse({
		description: 'Validação dos campos',
		status: HttpStatus.BAD_REQUEST,
		type: ReturnEntity.error('Verifique os campos'),
	})
	async givePermissionToUser(
		@Body() permissionDTO: CreatePermissionsDto,
		@CurrentUser() user: UserAuth,
		@Param('id') id: string,
	) {
		await this.permissionsService.givePermissionToUser(
			permissionDTO,
			user.empresa_id,
			+id,
		);

		return { success: true, message: 'Permissões concedidas com sucesso' };
	}
}
