import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs';
import { PrismaService } from '../services/prisma.service';
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

		const userData = await this.prisma.user.findFirst({
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

		let departamentos;

		if (!userData.acessa_todos_departamentos) {
			departamentos = userData.departamentos.map(
				(departamento) => departamento.departamento_id,
			);
		}

		const condominios = await this.prisma.pessoa.findMany({
			where: {
				empresa_id: user.empresa_id,
				tipos: { some: { tipo: { nome: 'condominio' } } },
				OR: [
					departamentos
						? {
								departamentos_condominio: {
									some: {
										departamento_id: {
											in: departamentos,
										},
									},
								},
						  }
						: {
								departamentos_condominio: {
									some: {},
								},
						  },
					!usuario_id || Number.isNaN(usuario_id)
						? {
								departamentos_condominio: {
									some: {
										departamento: {
											usuarios: {
												some: {
													usuario_id: idUser,
													acessa_todos_condominios:
														true,
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

		const now = Date.now();
		return next
			.handle()
			.pipe(tap(() => console.log(`Executado... ${Date.now() - now}ms`)));
	}
}
