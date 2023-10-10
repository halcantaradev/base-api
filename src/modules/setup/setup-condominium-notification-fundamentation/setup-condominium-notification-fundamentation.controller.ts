import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { SetupCondominiumNotificationFundamentationService } from './setup-condominium-notification-fundamentation.service';
import { CreateSetupCondominiumNotificationFundamentationDto } from './dto/create-setup-condominium-notification-fundamentation.dto';
import { UpdateSetupCondominiumNotificationFundamentationDto } from './dto/update-setup-condominium-notification-fundamentation.dto';

@Controller('setup-condominium-notification-fundamentation')
export class SetupCondominiumNotificationFundamentationController {
	constructor(
		private readonly setupCondominiumNotificationFundamentationService: SetupCondominiumNotificationFundamentationService,
	) {}

	@Post()
	create(
		@Body()
		createSetupCondominiumNotificationFundamentationDto: CreateSetupCondominiumNotificationFundamentationDto,
	) {
		return this.setupCondominiumNotificationFundamentationService.create(
			createSetupCondominiumNotificationFundamentationDto,
		);
	}

	@Get()
	findAll() {
		return this.setupCondominiumNotificationFundamentationService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.setupCondominiumNotificationFundamentationService.findOne(
			+id,
		);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body()
		updateSetupCondominiumNotificationFundamentationDto: UpdateSetupCondominiumNotificationFundamentationDto,
	) {
		return this.setupCondominiumNotificationFundamentationService.update(
			+id,
			updateSetupCondominiumNotificationFundamentationDto,
		);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.setupCondominiumNotificationFundamentationService.remove(
			+id,
		);
	}
}
