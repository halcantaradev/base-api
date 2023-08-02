import { Test, TestingModule } from '@nestjs/testing';
import { ContractTypesCondominiumService } from './contract-types-condominium.service';

describe('ContractTypesCondominiumService', () => {
	let service: ContractTypesCondominiumService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ContractTypesCondominiumService],
		}).compile();

		service = module.get<ContractTypesCondominiumService>(
			ContractTypesCondominiumService,
		);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
