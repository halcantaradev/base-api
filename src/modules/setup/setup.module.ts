import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/services/prisma/prisma.module';
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
		SetupCondominiumNotificationFundamentationService,
	],
	imports: [PrismaModule],
})
export class SetupModule {}
