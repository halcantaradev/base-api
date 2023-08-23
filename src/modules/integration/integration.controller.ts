import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import {
	Ctx,
	MessagePattern,
	Payload,
	RmqContext,
} from '@nestjs/microservices';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EntidadesSincronimo } from 'src/shared/consts/entidades-sincronismo';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Role } from 'src/shared/decorators/role.decorator';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { JwtAuthGuard } from '../public/auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../public/auth/guards/permission.guard';
import { SyncDataDto } from './dto/sync-data.dto';
import { IntegrationTokenReturn } from './entities/token-integration.entity copy';
import { IntegrationService } from './integration.service';
import { CurrentUserIntegration } from 'src/shared/decorators/current-user-integration.decorator';

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
		description: 'Ocorreu um erro ao iniciada com sucesso',
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		type: ReturnEntity.error(),
	})
	@UseGuards(PermissionGuard)
	@UseGuards(JwtAuthGuard)
	@Get('start')
	@Role('integracoes-listar-ativas')
	async startSync(@CurrentUser() user: UserAuth) {
		try {
			const integracoes = await this.integrationService.findAllByEmpresa(
				user.empresa_id,
			);

			for (const integ of integracoes) {
				this.integrationService.starSync('sync', {
					database_config: {
						id: integ.id,
						host: integ.host,
						banco: integ.banco,
						usuario: integ.usuario,
						senha: integ.senha,
						porta: integ.porta,
					},
					last_date_updated: integ.data_atualizacao,
					exec_url: process.env.API_URL + '/integracao/sincronizar',
					exec_url_token: integ.token,
				});
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

	@MessagePattern()
	async syncData(
		@CurrentUserIntegration() user: UserAuth,
		@Payload('params') body: SyncDataDto,
		@Ctx() context: RmqContext,
	) {
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
			return context;
		} catch (error) {
			console.log(error);
		}
	}

	@MessagePattern('sync')
	async getNotifications(@Payload() data: string) {
		return data;
	}

	@UseGuards(PermissionGuard)
	@UseGuards(JwtAuthGuard)
	@Get('send')
	sendFila() {
		try {
			this.integrationService.starSync('sync', 'teste');
			return { success: true };
		} catch (error) {
			return { success: false };
		}
	}
}
