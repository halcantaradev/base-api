import { Test, TestingModule } from '@nestjs/testing';
import { SystemParamsService } from './system-params.service';

describe('SystemParamsService', () => {
	let service: SystemParamsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [SystemParamsService],
		}).compile();

		service = module.get<SystemParamsService>(SystemParamsService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
