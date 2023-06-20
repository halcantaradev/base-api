import { Test, TestingModule } from '@nestjs/testing';
import { CondominiumService } from './condominium.service';

describe('CondominiumService', () => {
	let service: CondominiumService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [CondominiumService],
		}).compile();

		service = module.get<CondominiumService>(CondominiumService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
