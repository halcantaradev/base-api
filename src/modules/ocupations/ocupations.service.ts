import { Injectable } from '@nestjs/common';
import { CreateOcupationDto } from './dto/create-ocupation.dto';
import { UpdateOcupationDto } from './dto/update-ocupation.dto';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class OcupationsService {
	constructor(private readonly prisma: PrismaService) {}
	create(createOcupationDto: CreateOcupationDto) {
		return 'This action adds a new ocupation';
	}

	async findAll() {
		return {
			success: true,
			data: await this.prisma.cargo.findMany({ where: { ativo: true } }),
		};
	}

	findOne(id: number) {
		return `This action returns a #${id} ocupation`;
	}

	update(id: number, updateOcupationDto: UpdateOcupationDto) {
		return `This action updates a #${id} ocupation`;
	}

	remove(id: number) {
		return `This action removes a #${id} ocupation`;
	}
}
