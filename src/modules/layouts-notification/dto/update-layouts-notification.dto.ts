import { PartialType } from '@nestjs/swagger';
import { CreateLayoutsNotificationDto } from './create-layouts-notification.dto';
import { IsOptional } from 'class-validator';

export class UpdateLayoutsNotificationDto extends PartialType(
	CreateLayoutsNotificationDto,
) {
	@IsOptional()
	nome?: string;

	@IsOptional()
	modelo?: string;
}
