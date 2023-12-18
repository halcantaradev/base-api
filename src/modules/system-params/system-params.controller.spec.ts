import { Test, TestingModule } from '@nestjs/testing';
import { SystemParamsController } from './system-params.controller';
import { SystemParamsService } from './system-params.service';

describe('SystemParamsController', () => {
	let controller: SystemParamsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [SystemParamsController],
			providers: [SystemParamsService],
		}).compile();

		controller = module.get<SystemParamsController>(SystemParamsController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
