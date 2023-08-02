import { Test, TestingModule } from '@nestjs/testing';
import { ContractTypesCondominiumController } from './contract-types-condominium.controller';
import { ContractTypesCondominiumService } from './contract-types-condominium.service';

describe('ContractTypesCondominiumController', () => {
	let controller: ContractTypesCondominiumController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ContractTypesCondominiumController],
			providers: [ContractTypesCondominiumService],
		}).compile();

		controller = module.get<ContractTypesCondominiumController>(
			ContractTypesCondominiumController,
		);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
