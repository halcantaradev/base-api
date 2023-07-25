import { Test, TestingModule } from '@nestjs/testing';
import { SubsidiaryController } from './subsidiary.controller';
import { SubsidiaryService } from './subsidiary.service';

describe('SubsidiaryController', () => {
	let controller: SubsidiaryController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [SubsidiaryController],
			providers: [SubsidiaryService],
		}).compile();

		controller = module.get<SubsidiaryController>(SubsidiaryController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
