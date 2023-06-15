import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { ValidPermissionDTO } from './dto/valid-permission.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { PermissionReturn } from './entities/permission-return.entity';
@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
	constructor(private readonly permissionsService: PermissionsService) {}

	@Post('check')
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard('jwt'))
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
	checkAcesse(
		@Body() validPermission: ValidPermissionDTO,
		@CurrentUser() user: UserAuth,
	) {
		try {
			return this.permissionsService.checkAcess({
				user_id: user.id,
				cargo_id: user.cargo_id,
				action: validPermission.action,
			});
		} catch (error) {
			return { success: false, message: 'Permissão não encontrada' };
		}
	}
}
