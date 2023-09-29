import { Test, TestingModule } from '@nestjs/testing';
import { QueueGeneratePackageController } from './queue-generate-package.controller';
import { QueueGeneratePackageService } from './queue-generate-package.service';

describe('QueueGeneratePackageController', () => {
	let controller: QueueGeneratePackageController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [QueueGeneratePackageController],
			providers: [QueueGeneratePackageService],
		}).compile();

		controller = module.get<QueueGeneratePackageController>(
			QueueGeneratePackageController,
		);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
