import { Test, TestingModule } from '@nestjs/testing';
import { InfractionService } from './infraction.service';

describe('InfractionService', () => {
	let service: InfractionService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [InfractionService],
		}).compile();

		service = module.get<InfractionService>(InfractionService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
