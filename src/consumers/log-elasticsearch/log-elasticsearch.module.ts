import { Module } from '@nestjs/common';
import { LogElasticsearchController } from './log-elasticsearch.controller';
import { LogElasticsearchService } from './log-elasticsearch.service';
import { FilaModule } from 'src/shared/services/fila/fila.module';
import { ConfigModule } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
	imports: [
		FilaModule,
		ConfigModule.forRoot(),
		ElasticsearchModule.register({
			node: process.env.ELASTIC_NODE || 'http://localhost:9200',
			auth: {
				username: process.env.ELASTIC_USERNAME || 'elastic',
				password: process.env.ELASTIC_PASSWORD || 'dev@1234',
			},
		}),
	],
	controllers: [LogElasticsearchController],
	providers: [LogElasticsearchService],
})
export class LogElasticsearchModule {}
