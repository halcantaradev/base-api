import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ReturnMenuList } from './entities/return-menu-list.entity';

@ApiTags('Menus')
@Controller('menus')
@UseGuards(JwtAuthGuard)
export class MenuController {
	constructor(private readonly menuService: MenuService) {}

	@Get()
	@ApiOperation({ summary: 'Lista todos os menus que o usuário tem acesso' })
	@ApiResponse({
		description: 'Menus listados com sucesso',
		status: HttpStatus.OK,
		type: ReturnMenuList,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao listar os menus',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	async findAll(@CurrentUser() user: UserAuth) {
		return { success: true, data: await this.menuService.findAll(user) };
	}
}
