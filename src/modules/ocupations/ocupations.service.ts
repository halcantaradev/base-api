import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class OcupationsService {
	constructor(private readonly prisma: PrismaService) {}
	async findAllActive() {
		return {
			success: true,
			data: await this.prisma.cargo.findMany({ where: { ativo: true } }),
		};
	}
}