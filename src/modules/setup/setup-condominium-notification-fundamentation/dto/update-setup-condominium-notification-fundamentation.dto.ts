import { PartialType } from '@nestjs/swagger';
import { CreateSetupCondominiumNotificationFundamentationDto } from './create-setup-condominium-notification-fundamentation.dto';

export class UpdateSetupCondominiumNotificationFundamentationDto extends PartialType(CreateSetupCondominiumNotificationFundamentationDto) {}
