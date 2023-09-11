import { Test, TestingModule } from '@nestjs/testing';
import { NotificationEventsController } from './notification-events.controller';
import { NotificationEventsService } from './notification-events.service';

describe('NotificationEventsController', () => {
	let controller: NotificationEventsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [NotificationEventsController],
			providers: [NotificationEventsService],
		}).compile();

		controller = module.get<NotificationEventsController>(
			NotificationEventsController,
		);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
