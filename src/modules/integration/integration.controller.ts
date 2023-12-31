import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import {
	Ctx,
	MessagePattern,
	Payload,
	RmqContext,
} from '@nestjs/microservices';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EntidadesSincronimo } from 'src/shared/consts/entidades-sincronismo';
import { Filas } from 'src/shared/consts/filas.const';
import { CurrentUserIntegration } from 'src/shared/decorators/current-user-integration.decorator';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Role } from 'src/shared/decorators/role.decorator';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { JwtAuthConsumerGuard } from '../public/auth/guards/jwt-auth-consumer.guard';
import { JwtAuthGuard } from '../public/auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../public/auth/guards/permission.guard';
import { SyncDataDto } from './dto/sync-data.dto';
import { CondominioIntegrationDto } from './dto/types-integration.dto';
import { IntegrationTokenReturn } from './entities/token-integration-return.entity';
import { IntegrationService } from './integration.service';

@ApiTags('Integração')
@Controller('integracao')
export class IntegrationController {
	constructor(private readonly integrationService: IntegrationService) {}

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
	@UseGuards(PermissionGuard)
	@UseGuards(JwtAuthGuard)
	@Get('token/:id')
	@Role('integracoes-gerar-token')
	async getTokenApiAccess(
		@Param('id') id: number,
		@CurrentUser() user: UserAuth,
	) {
		delete user['iot'];
		await this.integrationService.generateApiTokenAccess(
			{
				sub: user.id,
				...user,
			},
			+id,
		);
		return {
			success: true,
		};
	}

	@ApiOperation({ summary: 'Inicia a sincronização' })
	@ApiResponse({
		description: 'Sincronização iniciada com sucesso!',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao iniciar sincronização',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	@UseGuards(PermissionGuard)
	@UseGuards(JwtAuthGuard)
	@Get('start')
	@Role('integracoes-iniciar-sincronismo')
	async startSync(@CurrentUser() user: UserAuth) {
		try {
			const integracoes = await this.integrationService.findAllByEmpresa(
				user.empresa_id,
			);

			for await (const integ of integracoes) {
				await this.integrationService.starSync('sync', {
					database_config: {
						id: integ.id,
						host: integ.host,
						descricao: integ.descricao,
						banco: integ.banco,
						usuario: integ.usuario,
						senha: integ.senha,
						porta: integ.porta,
						tipo: integ.tipo,
					},
					last_date_updated: integ.data_atualizacao,
					queue_exec:
						Filas.SYNC_INSERT + '-' + process.env.PREFIX_EMPRESA,
					token: integ.token,
				});

				await this.integrationService.setSyncing(integ.id, true);
			}
			console.log('Sincronismo iniciado');
			return {
				success: true,
			};
		} catch (error) {
			return {
				success: false,
			};
		}
	}

	@UseGuards(JwtAuthConsumerGuard)
	@MessagePattern()
	async syncData(
		@CurrentUserIntegration() user: UserAuth,
		@Payload('params') body: SyncDataDto<CondominioIntegrationDto>,
		@Payload('payload') payload: any,
		@Ctx() context: RmqContext,
	) {
		try {
			if (body.data) {
				console.log('Dados recebidos!');
				switch (body.tipo) {
					case EntidadesSincronimo.CONDOMINIO:
						await this.integrationService.syncCondominio(
							body.data,
							user.empresa_id,
							+payload.database_config.id,
						);
						break;
					case EntidadesSincronimo.UNIDADE:
						await this.integrationService.syncUnidade(
							body.data,
							user.empresa_id,
							+payload.database_config.id,
						);
						break;
				}

				if (body.data.current_date_update != undefined) {
					console.log('Sincronismo finalizado!');
					await this.integrationService.update(
						+payload.database_config.id,
						{
							data_atualizacao: new Date(
								body.data.current_date_update,
							),
						},
					);
					await this.integrationService.sendNotification({
						end: true,
						data_atualizacao: new Date(
							body.data.current_date_update,
						),
					});
				}
			} else {
				console.log('Sem dados para sincronismo!');
				await this.integrationService.setSyncing(
					+payload.database_config.id,
					false,
				);
				await this.integrationService.sendNotification({ end: true });
			}
			const channel = context.getChannelRef();
			const orginalMessage = context.getMessage();
			channel.ack(orginalMessage);
			return context;
		} catch (error) {
			console.log('========= Falha na sincronização =========');
			console.log(error);
			console.log('==========================================');
			return context;
		}
	}

	@ApiOperation({ summary: 'Retornar data da ultima sincronização' })
	@ApiResponse({
		description: 'Data retornada com sucesso!',
		status: HttpStatus.OK,
		type: ReturnEntity.success(),
	})
	@ApiResponse({
		description: 'Ocorreu um erro ao retornar data',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	@UseGuards(PermissionGuard)
	@UseGuards(JwtAuthGuard)
	@Get('last-update')
	@Role('integracoes-iniciar-sincronismo')
	async getLastUpdate(@CurrentUser() user: UserAuth) {
		return {
			success: true,
			data: (
				await this.integrationService.getLastUpdate(+user.empresa_id)
			)._max.data_atualizacao,
		};
	}

	@MessagePattern('sync')
	async getNotifications(@Payload() data: string) {
		return data;
	}
}
