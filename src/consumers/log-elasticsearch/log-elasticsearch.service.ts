import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class LogElasticsearchService {
	constructor(private readonly elasticsearchService: ElasticsearchService) {}

	async log(log: any) {
		await this.elasticsearchService.index(
			{
				index: 'http-logs',
				document: log,
			},
			{
				headers: {
					'content-type': 'application/json',
					accept: 'application/vnd.elasticsearch+json',
				},
			},
		);
	}
}
