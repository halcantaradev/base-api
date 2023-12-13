import { Module } from '@nestjs/common';
import { RocketService } from './rocket.service';
import { HttpModule } from '@nestjs/axios';

@Module({
	imports: [HttpModule],
	providers: [RocketService],
	exports: [RocketService],
})
export class RocketModule {}
