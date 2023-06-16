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
import { PermissionsService } from './permissions.service';
import { ValidPermissionDTO } from './dto/valid-permission.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { PermissionReturn } from './entities/permission-return.entity';
import { CreatePermissionsDto } from './dto/create-permission.dto';
import { PermissionGuard } from 'src/shared/guards/permission.guard';
import { CreatePermissionUserDto } from './dto/create-permission-user.dto';
@ApiTags('Permissions')
@UseGuards(AuthGuard('jwt'))
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
