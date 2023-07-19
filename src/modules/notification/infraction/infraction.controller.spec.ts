import { Test, TestingModule } from '@nestjs/testing';
import { InfractionController } from './infraction.controller';

describe('InfractionController', () => {
	let controller: InfractionController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [InfractionController],
		}).compile();

		controller = module.get<InfractionController>(InfractionController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
