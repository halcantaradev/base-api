import { Injectable, Logger } from '@nestjs/common';
import { IntervalWhen } from '../../decorators/interval.decorator';

@Injectable()
export class TasksService {
	private readonly logger = new Logger(TasksService.name);

	@IntervalWhen(1000 * 60 * 60, 'Task name', false)
	async execute() {
		try {
			//para executar tarefas periodicamente

			return {
				success: true,
			};
		} catch (error) {
			return {
				success: false,
			};
		}
	}
}
