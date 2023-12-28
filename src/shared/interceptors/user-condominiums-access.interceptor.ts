import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { UserAuth } from '../entities/user-auth.entity';

@Injectable()
export class UserCondominiumsAccess implements NestInterceptor {
	constructor(private readonly prisma: PrismaService) {}

	async intercept(context: ExecutionContext, next: CallHandler) {
		const request = context.switchToHttp().getRequest();
		const user: UserAuth = request.user;
		const usuario_id = +request.query.usuario_id;

		const idUser =
			usuario_id && !Number.isNaN(usuario_id) ? usuario_id : user.id;

		const userData = await this.prisma.usuario.findFirst({
			include: {
				departamentos: {
					select: {
						departamento_id: true,
					},
				},
			},
			where: {
				id: idUser,
			},
		});

		const departamentos = userData.departamentos.map(
			(departamento) => departamento.departamento_id,
		);

		const condominios = await this.prisma.pessoa.findMany({
			where: {
				empresa_id: user.empresa_id,
				tipos: { some: { tipo: { nome: 'condominio' } } },
				departamentos_condominio: departamentos
					? {
							some: {
								departamento_id: {
									in: departamentos,
								},
							},
					  }
					: undefined,
				OR: [
					!usuario_id || Number.isNaN(usuario_id)
						? {
								departamentos_condominio: {
									some: {
										departamento: {
											usuarios: {
												some: {
													usuario_id: idUser,
													delimitar_acesso: false,
												},
											},
										},
									},
								},
						  }
						: null,
					!usuario_id || Number.isNaN(usuario_id)
						? {
								usuarios_condominio: {
									some: {
										usuario_id: idUser,
									},
								},
						  }
						: null,
				].filter((filter) => !!filter),
			},
		});

		request.condominios = condominios.map((condominio) => condominio.id);

		return next.handle().pipe();
	}
}
