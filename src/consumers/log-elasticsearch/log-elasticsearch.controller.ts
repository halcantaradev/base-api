import { Controller } from '@nestjs/common';
import {
	Ctx,
	MessagePattern,
	Payload,
	RmqContext,
} from '@nestjs/microservices';
import { LogElasticsearchService } from './log-elasticsearch.service';

@Controller('log-elasticsearch')
export class LogElasticsearchController {
	constructor(private readonly elasticService: LogElasticsearchService) {}

	@MessagePattern('log')
	async log(@Ctx() context: RmqContext, @Payload() body: any) {
		await this.elasticService.log(body);

		return context;
	}
}
