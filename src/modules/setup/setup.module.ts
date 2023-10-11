import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { SetupCondominiumNotificationFundamentationController } from './setup-condominium-notification-fundamentation/setup-condominium-notification-fundamentation.controller';
import { SetupCondominiumNotificationFundamentationService } from './setup-condominium-notification-fundamentation/setup-condominium-notification-fundamentation.service';
import { SetupController } from './setup.controller';
import { SetupService } from './setup.service';

@Module({
	controllers: [
		SetupController,
		SetupCondominiumNotificationFundamentationController,
	],
	providers: [
		SetupService,
		PrismaService,
		SetupCondominiumNotificationFundamentationService,
	],
	imports: [],
})
export class SetupModule {}
