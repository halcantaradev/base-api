import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { IntegrationModule } from 'src/modules/integration/integration.module';

@Module({
	imports: [IntegrationModule],
	providers: [TasksService],
})
export class TasksModule {}
