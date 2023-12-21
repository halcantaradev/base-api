import { Controller, Get, UseGuards } from '@nestjs/common';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { CompanyStatisticsService } from './company-statistics.service';

@ApiTags('Estatísticas da empresa')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('company-statistics')
export class CompanyStatisticsController {
	constructor(
		private readonly companyStatisticsService: CompanyStatisticsService,
	) {}

	@Get()
	async get() {
		return {
			success: true,
			data: await this.companyStatisticsService.getDataCondominio(),
		};
	}
}
