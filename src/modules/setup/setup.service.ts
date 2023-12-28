import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma/prisma.service';
import { UpdateSetupCompanyThemeDto } from './dto/update-setup-company-theme.dto';
import { UpdateSetupCompanyDto } from './dto/update-setup-company.dto';

@Injectable()
export class SetupService {
	constructor(private readonly prisma: PrismaService) {}

	async findBikersPackage(empresa_id: number) {
		return this.prisma.usuario.findMany({
			select: {
				id: true,
				nome: true,
			},
			where: {
				ativo: true,
				empresas: {
					some: {
						cargo: {
							perfil: 2,
						},
						empresa_id: empresa_id,
					},
				},
			},
		});
	}

	async findSetupSystem(id: number) {
		return this.prisma.sistemaSetup.findFirst({
			where: {
				empresa_id: id,
			},
		});
	}

	async findOneCompany(empresa_id: number) {
		const empresa = await this.prisma.pessoa.findUnique({
			where: {
				id: empresa_id,
			},
		});

		if (!empresa) throw new BadRequestException('Empresa não encontrada');

		return empresa;
	}

	async updateCompany(
		updateSetupCompanyDto: UpdateSetupCompanyDto,
		empresa_id: number,
	) {
		await this.findOneCompany(empresa_id);

		return this.prisma.pessoa.update({
			data: {
				nome: updateSetupCompanyDto.nome || undefined,
				cnpj: updateSetupCompanyDto.cnpj || undefined,
				numero: updateSetupCompanyDto.numero || undefined,
				endereco: updateSetupCompanyDto.endereco || undefined,
				cep: updateSetupCompanyDto.cep || undefined,
				bairro: updateSetupCompanyDto.bairro || undefined,
				cidade: updateSetupCompanyDto.cidade || undefined,
				uf: updateSetupCompanyDto.uf || undefined,
			},
			where: {
				id: empresa_id,
			},
		});
	}

	async findCompanyTheme(empresa_id: number) {
		return this.prisma.tema.findUnique({
			select: {
				logo: true,
				logo_clara: true,
			},
			where: {
				empresa_id: empresa_id,
			},
		});
	}

	async updateCompanyTheme(
		updateSetupCompanyThemeDto: UpdateSetupCompanyThemeDto,
		empresa_id: number,
	) {
		return this.prisma.tema.upsert({
			create: {
				empresa_id: empresa_id,
				nome: `Empresa ${empresa_id}`,
				logo: updateSetupCompanyThemeDto.logo || null,
				logo_clara: updateSetupCompanyThemeDto.logo_clara || null,
			},
			update: {
				logo: updateSetupCompanyThemeDto.logo || undefined,
				logo_clara: updateSetupCompanyThemeDto.logo_clara || undefined,
			},
			where: {
				empresa_id: empresa_id,
			},
		});
	}
}
