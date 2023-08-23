import { Test, TestingModule } from '@nestjs/testing';
import { ProtocolController } from './protocol.controller';
import { ProtocolService } from './protocol.service';

describe('ProtocolController', () => {
	let controller: ProtocolController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ProtocolController],
			providers: [ProtocolService],
		}).compile();

		controller = module.get<ProtocolController>(ProtocolController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
