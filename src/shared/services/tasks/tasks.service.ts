import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { IntegrationService } from 'src/modules/integration/integration.service';
import { Filas } from 'src/shared/consts/filas.const';

@Injectable()
export class TasksService {
	private readonly logger = new Logger(TasksService.name);
	constructor(private readonly integrationService: IntegrationService) {}

	@Interval(
		1000 *
			60 *
			(process.env.SYNC_MINUTES_INTERVAL
				? +process.env.SYNC_MINUTES_INTERVAL
				: 60),
	)
	async execute() {
		try {
			const integracoes = await this.integrationService.findAllActive();

			for await (const integ of integracoes) {
				await this.integrationService.starSync('sync', {
					database_config: {
						id: integ.id,
						host: integ.host,
						banco: integ.banco,
						usuario: integ.usuario,
						senha: integ.senha,
						porta: integ.porta,
					},
					last_date_updated: integ.data_atualizacao,
					queue_exec:
						Filas.SYNC_INSERT + '-' + process.env.PREFIX_EMPRESA,
					token: integ.token,
				});

				await this.integrationService.setSyncing(integ.id, true);

				this.integrationService.sendGenericLog({
					tipo: 'Sincronismo iniciado',
					data: new Date(),
					base: integ.banco,
				});
			}

			if (!integracoes?.length) {
				this.integrationService.sendGenericLog({
					tipo: 'Sincronismo não iniciado',
					data: new Date(),
					base: 'A sincronização já está sendo feita ou não há integrações ativas',
				});

				this.logger.warn(`Sincronismo não iniciado via job...`);

				this.logger.warn(
					`A sincronização já está sendo feita ou não há integrações ativas`,
				);
			} else {
				this.logger.log(`Sincronismo iniciado via job...`);
			}

			return {
				success: true,
			};
		} catch (error) {
			return {
				success: false,
			};
		}
	}
}
