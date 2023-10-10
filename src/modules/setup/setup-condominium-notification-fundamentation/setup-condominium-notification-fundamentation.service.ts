import { Injectable } from '@nestjs/common';
import { CreateSetupCondominiumNotificationFundamentationDto } from './dto/create-setup-condominium-notification-fundamentation.dto';
import { UpdateSetupCondominiumNotificationFundamentationDto } from './dto/update-setup-condominium-notification-fundamentation.dto';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class SetupCondominiumNotificationFundamentationService {
	constructor(private readonly prisma: PrismaService) {}

	create(
		createSetupCondominiumNotificationFundamentationDto: CreateSetupCondominiumNotificationFundamentationDto,
	) {
		return this.prisma;
	}

	findAll() {
		return `This action returns all setupCondominiumNotificationFundamentation`;
	}

	findOne(id: number) {
		return `This action returns a #${id} setupCondominiumNotificationFundamentation`;
	}

	update(
		id: number,
		updateSetupCondominiumNotificationFundamentationDto: UpdateSetupCondominiumNotificationFundamentationDto,
	) {
		return `This action updates a #${id} setupCondominiumNotificationFundamentation`;
	}

	remove(id: number) {
		return `This action removes a #${id} setupCondominiumNotificationFundamentation`;
	}
}
