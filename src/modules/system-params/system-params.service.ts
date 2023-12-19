import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

@Injectable()
export class SystemParamsService {
	constructor(private readonly prisma: PrismaService) {}
	findAllActive(empresa_id: number) {
		return this.prisma.parametroSistema.findMany({
			where: { empresa_id, ativo: true },
		});
	}
}
