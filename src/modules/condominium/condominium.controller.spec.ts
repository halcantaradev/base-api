import { Test, TestingModule } from '@nestjs/testing';
import { CondominiumController } from './condominium.controller';
import { CondominiumService } from './condominium.service';

describe('CondominiumController', () => {
	let controller: CondominiumController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CondominiumController],
			providers: [CondominiumService],
		}).compile();

		controller = module.get<CondominiumController>(CondominiumController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
