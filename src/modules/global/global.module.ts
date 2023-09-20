import { Global, Module } from '@nestjs/common';
import { FilaModule } from 'src/shared/services/fila/fila.module';
import { LoggerService } from 'src/shared/services/logger.service';

@Global()
@Module({
	imports: [FilaModule],
	providers: [LoggerService],
	exports: [LoggerService],
})
export class GlobalModule {}
