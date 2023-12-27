import { Controller, Get, UseGuards } from '@nestjs/common';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { CompanyStatisticsService } from './company-statistics.service';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { UserAuth } from 'src/shared/entities/user-auth.entity';

@ApiTags('Estatísticas da empresa')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('company-statistics')
export class CompanyStatisticsController {
	constructor(
		private readonly companyStatisticsService: CompanyStatisticsService,
	) {}

	@Get()
	async get(@CurrentUser() user: UserAuth) {
		return {
			success: true,
			data: {
				condominios:
					await this.companyStatisticsService.getDataCondominio(
						user.empresa_id,
					),
				notificacoes:
					await this.companyStatisticsService.getNotificacoes(
						user.empresa_id,
					),
			},
		};
	}
}
