import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreateProtocolDto } from './dto/create-protocol.dto';
import { UpdateProtocolDto } from './dto/update-protocol.dto';
import { Prisma } from '@prisma/client';
import { UserAuth } from 'src/shared/entities/user-auth.entity';
import { FiltersProtocolDto } from './dto/filters-protocol.dto';
import { CreateDocumentProtocolDto } from './dto/create-document-protocol.dto';
import { UpdateDocumentProtocolDto } from './dto/update-document-protocol.dto';
import { Pagination } from 'src/shared/entities/pagination.entity';
import { setCustomHour } from 'src/shared/helpers/date.helper';
import { FiltersProtocolCondominiumDto } from './dto/filters-protocol-condominium.dto';
import { PersonService } from '../person/person.service';
import { EmailService } from 'src/shared/services/email.service';
import { SendEmailProtocolDto } from './dto/send-email-protocol.dto';
import { HandlebarsService } from 'src/shared/services/handlebars.service';
import { LayoutConstsService } from 'src/shared/services/layout-consts.service';
import { PdfService } from 'src/shared/services/pdf.service';
import { ExternalJwtService } from 'src/shared/services/external-jwt/external-jwt.service';
import { Contact } from 'src/shared/consts/contact.const';
import { ContactType } from 'src/shared/consts/contact-type.const';

@Injectable()
export class ProtocolService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly pdfService: PdfService,
		private readonly emailService: EmailService,
		private readonly pessoaService: PersonService,
		private readonly layoutService: LayoutConstsService,
		private readonly handleBarService: HandlebarsService,
		private readonly externalJtwService: ExternalJwtService,
	) {}

	select: Prisma.ProtocoloSelect = {
		id: true,
		tipo: true,
		origem_usuario: {
			select: {
				id: true,
				nome: true,
			},
		},
		origem_departamento: {
			select: {
				id: true,
				nome: true,
			},
		},
		destino_usuario: {
			select: {
				id: true,
				nome: true,
			},
		},
		destino_departamento: {
			select: {
				id: true,
				nome: true,
			},
		},

		retorna_malote_vazio: true,
		ativo: true,
		situacao: true,

		finalizado: true,
		data_finalizado: true,
		created_at: true,
		updated_at: true,
	};

	selectDocuments: Prisma.ProtocoloDocumentoSelect = {
		id: true,
		protocolo_id: true,
		tipo_documento: {
			select: {
				id: true,
				nome: true,
			},
		},
		aceite_usuario: {
			select: {
				id: true,
				nome: true,
			},
		},
		condominio: {
			select: {
				id: true,
				nome: true,
			},
		},
		discriminacao: true,
		observacao: true,
		data_aceite: true,
		aceito: true,
		created_at: true,
		updated_at: true,
	};

	create(createProtocolDto: CreateProtocolDto, user: UserAuth) {
		return this.prisma.protocolo.create({
			data: {
				empresa_id: user.empresa_id,
				tipo: createProtocolDto.tipo,
				destino_departamento_id:
					createProtocolDto.destino_departamento_id,
				destino_usuario_id: createProtocolDto.destino_usuario_id,
				origem_usuario_id: user.id,
				origem_departamento_id:
					createProtocolDto.origem_departamento_id,
				retorna_malote_vazio: createProtocolDto.retorna_malote_vazio,
				ativo: true,
			},
		});
	}

	async findBy(
		filtersProtocolDto: FiltersProtocolDto,
		user: UserAuth,
		pagination?: Pagination,
	) {
		return await this.prisma.protocolo.findMany({
			select: this.select,
			take: !filtersProtocolDto && pagination?.page ? 20 : 100,
			skip:
				!filtersProtocolDto && pagination?.page
					? (pagination?.page - 1) * 20
					: undefined,
			where: {
				id: !Number.isNaN(+filtersProtocolDto.id)
					? +filtersProtocolDto.id
					: undefined,

				destino_departamento_id:
					filtersProtocolDto.destino_departamento_ids
						? {
								in: filtersProtocolDto.destino_departamento_ids,
						  }
						: undefined,
				origem_usuario_id:
					filtersProtocolDto.origem_usuario_id || undefined,
				destino_usuario_id:
					filtersProtocolDto.destino_usuario_id || undefined,
				documentos:
					filtersProtocolDto.condominios_ids ||
					filtersProtocolDto?.aceito_por
						? {
								some: {
									condominio_id: filtersProtocolDto
										.condominios_ids?.length
										? {
												in: filtersProtocolDto.condominios_ids,
										  }
										: undefined,
									aceite_usuario_id:
										filtersProtocolDto?.aceito_por ||
										undefined,
									data_aceite: filtersProtocolDto.data_aceito
										?.length
										? {
												lte:
													setCustomHour(
														filtersProtocolDto
															.data_aceito[1],
														23,
														59,
														59,
													) || undefined,
												gte:
													setCustomHour(
														filtersProtocolDto
															.data_aceito[0],
													) || undefined,
										  }
										: undefined,
								},
						  }
						: undefined,
				tipo: filtersProtocolDto.tipo || undefined,
				situacao: filtersProtocolDto.situacao || undefined,
				created_at: filtersProtocolDto.data_emissao
					? {
							lte:
								setCustomHour(
									filtersProtocolDto.data_emissao[1],
									23,
									59,
									59,
								) || undefined,
							gte:
								setCustomHour(
									filtersProtocolDto.data_emissao[0],
								) || undefined,
					  }
					: undefined,
				ativo: filtersProtocolDto.ativo || undefined,
				excluido: false,
				origem_departamento:
					!user.acessa_todos_departamentos ||
					filtersProtocolDto.origem_departament_ids
						? {
								id: filtersProtocolDto.origem_departament_ids
									? {
											in: filtersProtocolDto.origem_departament_ids,
									  }
									: undefined,
								usuarios: !user.acessa_todos_departamentos
									? {
											some: {
												usuario: {
													id: user.id,
												},
											},
									  }
									: undefined,
						  }
						: undefined,
			},
		});
	}

	async findOneById(id: number, user: UserAuth) {
		const data = await this.prisma.protocolo.findFirst({
			select: this.select,
			where: {
				id,
				excluido: false,
				OR: !user.acessa_todos_departamentos
					? [
							{
								destino_departamento: {
									usuarios: {
										some: {
											usuario: {
												id: user.id,
											},
										},
									},
								},
							},
							{
								origem_departamento: {
									usuarios: {
										some: {
											usuario: {
												id: user.id,
											},
										},
									},
								},
							},
					  ]
					: undefined,
			},
		});

		return {
			success: true,
			data,
		};
	}

	findById(id: number, user: UserAuth) {
		if (Number.isNaN(id))
			throw new BadRequestException('Protocolo não encontrado');

		return this.prisma.protocolo.findFirst({
			select: this.select,
			where: {
				id,
				excluido: false,
				origem_departamento: !user.acessa_todos_departamentos
					? {
							usuarios: {
								some: {
									usuario: {
										id: user.id,
									},
								},
							},
					  }
					: undefined,
			},
		});
	}

	async update(
		id: number,
		updateProtocolDto: UpdateProtocolDto,
		user: UserAuth,
	) {
		const protocolo = await this.findById(id, user);

		if (!protocolo || protocolo.situacao != 1)
			throw new BadRequestException('Protocolo não encontrado');

		return this.prisma.protocolo.update({
			data: {
				tipo: updateProtocolDto.tipo || undefined,
				destino_departamento_id:
					updateProtocolDto.destino_departamento_id || undefined,
				destino_usuario_id: updateProtocolDto.destino_usuario_id,
				origem_usuario_id: updateProtocolDto.origem_departamento_id
					? user.id
					: undefined,
				origem_departamento_id:
					updateProtocolDto.origem_departamento_id || undefined,
				retorna_malote_vazio:
					updateProtocolDto.retorna_malote_vazio || undefined,
				ativo: updateProtocolDto.ativo || undefined,
				finalizado: updateProtocolDto.finalizado || undefined,
				data_finalizado: updateProtocolDto.finalizado
					? new Date()
					: undefined,
			},
			where: {
				id,
			},
		});
	}

	async createDocument(
		protocolo_id: number,
		createDocumentProtocolDto: CreateDocumentProtocolDto,
		user: UserAuth,
	) {
		const protocolo = await this.findById(protocolo_id, user);

		if (!protocolo || Number.isNaN(protocolo_id))
			throw new BadRequestException('Protocolo não encontrado');

		return this.prisma.protocoloDocumento.create({
			data: {
				protocolo_id,
				discriminacao: createDocumentProtocolDto.discriminacao,
				observacao: createDocumentProtocolDto.observacao || null,
				condominio_id: createDocumentProtocolDto.condominio_id,
				tipo_documento_id: createDocumentProtocolDto.tipo_documento_id,
			},
		});
	}

	async findAllDocuments(protocolo_id: number, user?: UserAuth) {
		const protocolo = await this.findById(protocolo_id, user);

		if (!protocolo || Number.isNaN(protocolo_id))
			throw new BadRequestException('Protocolo não encontrado');

		return this.prisma.protocoloDocumento.findMany({
			select: {
				id: true,
				created_at: true,
				protocolo: {
					select: {
						origem_usuario: {
							select: {
								nome: true,
							},
						},
					},
				},
				tipo_documento: {
					select: {
						nome: true,
					},
				},
				discriminacao: true,
				data_aceite: true,
				aceite_usuario: {
					select: {
						nome: true,
					},
				},
				condominio: {
					select: {
						id: true,
						nome: true,
					},
				},
			},
			where: {
				protocolo_id,
				excluido: false,
				condominio: !user.acessa_todos_departamentos
					? {
							usuarios_condominio: {
								some: {
									usuario: {
										id: user?.id,
									},
								},
							},
					  }
					: undefined,
			},
		});
	}

	async print(protocol_id: number, user: UserAuth) {
		const data = await this.findById(protocol_id, user);

		if (!data) {
			throw new BadRequestException('Protocolo não encontrado');
		}

		const layout = this.layoutService.replaceLayoutVars(
			this.layoutService.getTemplate('protocolo.html'),
		);

		const dataToPrint = await this.dataToHandle(protocol_id);

		const protocoloFile = this.handleBarService.compile(
			layout,
			dataToPrint,
		);

		return this.pdfService.getPDF(protocoloFile);
	}

	async dataToHandle(id: number) {
		const protocol = await this.prisma.protocolo.findUnique({
			where: {
				id,
			},
		});

		if (!protocol || Number.isNaN(id))
			throw new BadRequestException('Protocolo não encontrado');

		const total_documentos = await this.prisma.protocoloDocumento.count({
			where: {
				protocolo_id: id,
			},
		});

		const documentsProtocol = await this.prisma.protocoloDocumento.findMany(
			{
				select: {
					created_at: true,
					protocolo: {
						select: {
							origem_usuario: {
								select: {
									nome: true,
								},
							},
						},
					},
					tipo_documento: {
						select: {
							nome: true,
						},
					},
					discriminacao: true,
					data_aceite: true,
					aceite_usuario: {
						select: {
							nome: true,
						},
					},
					condominio: {
						select: {
							id: true,
							nome: true,
						},
					},
				},
				where: {
					protocolo_id: id,
					excluido: false,
				},
			},
		);

		const empresa = await this.prisma.pessoa.findUnique({
			select: {
				nome: true,
				temas: {
					select: {
						logo: true,
					},
				},
			},
			where: {
				id: protocol.empresa_id,
			},
		});

		const data: any = {};

		data.data_atual_extenso = new Intl.DateTimeFormat('pt-BR', {
			dateStyle: 'long',
		}).format(new Date());

		data.numero_protocolo = protocol.id;
		data.total_documentos_protocolo = total_documentos;
		data.empresa_nome = empresa.nome || '';
		data.empresa_logo = empresa?.temas[0]?.logo;

		const condominios = [];

		documentsProtocol.forEach((item) => {
			if (!condominios[item.condominio.id]) {
				condominios[item.condominio.id] = {
					id: item.condominio.id,
					nome: item.condominio.nome,
					documents: [
						{
							emissao: item.created_at
								? new Intl.DateTimeFormat('pt-BR').format(
										item?.created_at,
								  )
								: null,
							usuario: item?.protocolo?.origem_usuario?.nome,
							tipo: item?.tipo_documento?.nome,
							discriminacao: item?.discriminacao,
							recebido: item.data_aceite
								? new Intl.DateTimeFormat('pt-BR').format(
										item.data_aceite,
								  )
								: null,
							recebido_por: item?.aceite_usuario?.nome,
						},
					],
				};
			} else {
				condominios[item.condominio.id].documents.push({
					emissao: item.created_at
						? new Intl.DateTimeFormat('pt-BR').format(
								item?.created_at,
						  )
						: null,
					usuario: item?.protocolo?.origem_usuario?.nome,
					tipo: item?.tipo_documento?.nome,
					discriminacao: item?.discriminacao,
					recebido: item.data_aceite
						? new Intl.DateTimeFormat('pt-BR').format(
								item.data_aceite,
						  )
						: null,
					recebido_por: item?.aceite_usuario?.nome,
				});
			}
		});

		data.condominios = condominios;
		return data;
	}

	async findDocumentById(
		protocolo_id: number,
		document_id: number,
		user: UserAuth,
	) {
		const protocolo = await this.findById(protocolo_id, user);

		if (!protocolo || Number.isNaN(protocolo_id))
			throw new BadRequestException('Protocolo não encontrado');

		if (Number.isNaN(document_id))
			throw new BadRequestException('Documento não encontrado');

		const document = await this.prisma.protocoloDocumento.findFirst({
			select: this.selectDocuments,
			where: {
				protocolo_id,
				id: document_id,
			},
		});

		const arquivos = await this.prisma.arquivo.findMany({
			where: {
				ativo: true,
				origem: 2,
				referencia_id: document_id,
			},
		});

		return { ...document, arquivos };
	}

	async updateDocument(
		protocolo_id: number,
		document_id: number,
		updateDocumentProtocolDto: UpdateDocumentProtocolDto,
		user: UserAuth,
		exclude = false,
	) {
		const protocolo = await this.findById(protocolo_id, user);

		if (!protocolo || Number.isNaN(protocolo_id))
			throw new BadRequestException('Protocolo não encontrado');

		const document = await this.findDocumentById(
			protocolo_id,
			document_id,
			user,
		);

		if (!document || Number.isNaN(document_id) || document.aceito)
			throw new BadRequestException('Documento não encontrado');

		return this.prisma.protocoloDocumento.update({
			data: {
				discriminacao: updateDocumentProtocolDto.discriminacao,
				observacao: updateDocumentProtocolDto.observacao,
				condominio_id: updateDocumentProtocolDto.condominio_id,
				tipo_documento_id: updateDocumentProtocolDto.tipo_documento_id,
				excluido: exclude,
			},
			where: {
				id: document_id,
			},
		});
	}

	async findAllCondominiums(
		filtersProtocolCondominiumDto: FiltersProtocolCondominiumDto,
		condominiums: number[],
		user: UserAuth,
	) {
		const departamento = await this.prisma.departamento.findFirst({
			where: {
				id: filtersProtocolCondominiumDto.departamento_id,
				empresa_id: user.empresa_id,
			},
		});

		if (!departamento) return [];

		return (
			await this.pessoaService.findAll(
				'condominio',
				{},
				{
					id:
						departamento.nac && !user.acessa_todos_departamentos
							? {
									in: condominiums,
							  }
							: undefined,
					nome: filtersProtocolCondominiumDto.busca
						? {
								contains: filtersProtocolCondominiumDto.busca,
								mode: 'insensitive',
						  }
						: undefined,
					departamentos_condominio: {
						some: departamento.nac
							? {
									departamento_id:
										filtersProtocolCondominiumDto.departamento_id,
							  }
							: {},
					},
					empresa_id: user.empresa_id,
					ativo: true,
				},
			)
		).data;
	}

	async findEmails(protocolo_id: number, user: UserAuth) {
		const protocolo = await this.findById(protocolo_id, user);

		if (!protocolo || Number.isNaN(protocolo_id))
			throw new BadRequestException('Protocolo não encontrado');

		const condominios = await this.prisma.protocoloDocumento.findMany({
			select: {
				condominio: {
					select: {
						id: true,
						nome: true,
						condominio_administracao: {
							select: {
								id: true,
								nome: true,
							},
						},
					},
				},
			},
			distinct: ['condominio_id'],
			where: {
				protocolo_id,
				excluido: false,
			},
		});

		const administracao_ids = [];

		condominios.forEach((condominio) => {
			administracao_ids.push(
				...condominio.condominio.condominio_administracao.map(
					(adm) => adm.id,
				),
			);
		});

		const contatos = await this.prisma.contato.findMany({
			select: {
				id: true,
				contato: true,
				tipo: true,
				descricao: true,
				referencia_id: true,
			},
			where: {
				origem: Contact.ADMINISTRACAO_CONDOMINIO,
				referencia_id: {
					in: administracao_ids,
				},
				tipo: ContactType.EMAIL,
			},
		});

		return condominios.map((condominio) => ({
			...condominio.condominio,
			condominio_administracao: undefined,
			contatos: contatos
				.filter((contato) =>
					condominio.condominio.condominio_administracao
						.map((adm) => adm.id)
						.includes(contato.referencia_id),
				)
				.map((contato) => ({
					...contato,
					referencia_id: undefined,
					proprietario:
						condominio.condominio.condominio_administracao.find(
							(proprietario) =>
								proprietario.id == contato.referencia_id,
						),
				})),
		}));
	}

	async sendMail(
		protocolo_id: number,
		sendEmailProtocolDto: SendEmailProtocolDto,
		user: UserAuth,
	) {
		const protocolo = await this.findById(protocolo_id, user);

		if (!protocolo || Number.isNaN(protocolo_id))
			throw new BadRequestException('Protocolo não encontrado');

		const documentos = await this.prisma.protocoloDocumento.findMany({
			select: {
				discriminacao: true,
				condominio: {
					select: {
						id: true,
						nome: true,
						condominio_administracao: {
							select: {
								id: true,
								nome: true,
							},
						},
					},
				},
			},
			distinct: ['condominio_id'],
			where: {
				protocolo_id,
				condominio_id: sendEmailProtocolDto.condominio_id,
				excluido: false,
			},
		});

		const administracao_ids = [];

		documentos.forEach((documento) => {
			administracao_ids.push(
				...documento.condominio.condominio_administracao.map(
					(adm) => adm.id,
				),
			);
		});

		const contatos = await this.prisma.contato.findMany({
			select: {
				contato: true,
			},
			distinct: ['contato'],
			where: {
				id: {
					in: sendEmailProtocolDto.contatos_ids,
				},
				origem: Contact.ADMINISTRACAO_CONDOMINIO,
				referencia_id: {
					in: administracao_ids,
				},
				tipo: ContactType.EMAIL,
			},
		});

		const setupEmail = await this.prisma.emailSetup.findFirst({
			where: {
				empresa_id: user.empresa_id,
				padrao: true,
			},
		});

		const link = this.externalJtwService.generateURLExternal({
			origin: 'protocolos',
			data: { id: protocolo_id },
		});

		await Promise.all(
			contatos.map((contato) =>
				this.emailService.send({
					to: contato.contato,
					from: process.env.EMAIL_SEND_PROVIDER,
					subject: `Protocolo ${protocolo_id} enviado para um novo setor`,
					html: `
					<p>Protocolo para novo setor com os arquivos:</p> 
					${documentos.map((documento) => documento.discriminacao)}
					<p>Segue o link para visualizar os dados do protocolo</p> 
					${link}
					`,
					setup: {
						MAIL_SMTP_HOST: setupEmail.host,
						MAIL_SMTP_PORT: setupEmail.port,
						MAIL_SMTP_USER: setupEmail.user,
						MAIL_SMTP_PASS: setupEmail.password,
						MAIL_SMTP_SECURE: setupEmail.secure,
					},
				}),
			),
		);

		return;
	}
}
