import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Post,
	UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EntidadesSincronimo } from 'src/shared/consts/entidades-sincronismo';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Role } from 'src/shared/decorators/role.decorator';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { FilaService } from 'src/shared/services/fila.service';
import { JwtAuthGuard } from '../public/auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../public/auth/guards/permission.guard';
import { SyncDataDto } from './dto/sync-data.dto';
import { IntegrationTokenReturn } from './entities/token-integration.entity copy';
import { IntegrationService } from './integration.service';
import { Filas } from 'src/shared/consts/filas.const';

@ApiTags('Integração')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('integracao')
export class IntegrationController {
	constructor(
		private readonly integrationService: IntegrationService,
		private readonly filaService: FilaService,
	) {}

	@ApiOperation({ summary: 'Gera um novo token para a integração' })
	@ApiResponse({
		description: 'Token gerado com sucesso!',
		status: HttpStatus.OK,
		type: IntegrationTokenReturn,
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao gerar o token',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	@Get('token')
	@Role('integracoes-gerar-token')
	getTokenApiAccess(@CurrentUser() user: UserAuth) {
		return {
			api_token: this.integrationService.generateApiTokenAccess({
				...user,
			}),
			exp: false,
		};
	}

	@ApiOperation({ summary: 'Inicia a sincronização' })
	@ApiResponse({
		description: 'Sincronização iniciada com sucesso!',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao iniciada com sucesso',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	@Get('start')
	@Role('integracoes-listar-ativas')
	async findAllByEmpresa(@CurrentUser() user: UserAuth) {
		try {
			const integracoes = await this.integrationService.findAllByEmpresa(
				user.empresa_id,
			);

			for await (const integ of integracoes) {
				await this.filaService.subscribe(
					Filas.SYNC + '-' + process.env.PREFIX_EMPRESA,
					{
						database_config: {
							id: integ.id,
							host: integ.host,
							banco: integ.banco,
							usuario: integ.usuario,
							senha: integ.senha,
							porta: integ.porta,
						},
						last_date_updated: integ.data_atualizacao,
						exec_url:
							process.env.API_URL + '/integracao/sincronizar',
						exec_url_token: process.env.INTEGRACAO_ACCESS_TOKEN,
					},
				);
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

	@ApiOperation({ summary: 'Inicia a sincronização' })
	@ApiResponse({
		description: 'Sincronização iniciada com sucesso!',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao iniciada com sucesso',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	@Post('sincronizar')
	async syncData(@Body() body: SyncDataDto, @CurrentUser() user: UserAuth) {
		try {
			switch (body.tipo) {
				case EntidadesSincronimo.CONDOMINIO:
					await this.integrationService.syncCondominio(
						body.data,
						user.empresa_id,
					);
					break;
			}

			if (body.data.current_date_update != undefined) {
				await this.integrationService.update(
					+body.payload.database_config.id,
					{
						data_atualizacao: new Date(
							body.data.current_date_update,
						),
					},
				);
			}

			return { success: true };
		} catch (error) {
			return { success: false };
		}
	}
}
