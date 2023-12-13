import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
	constructor(private readonly prisma: PrismaService) {}

	findOne(id: number, empresa_id: number) {
		if (Number.isNaN(id) || empresa_id != id)
			throw new BadRequestException('Empresa não encontrada');

		return this.prisma.pessoa.findUnique({
			where: {
				id: empresa_id,
			},
		});
	}

	update({
		id,
		updateCompanyDto,
		empresa_id,
	}: {
		id: number;
		updateCompanyDto: UpdateCompanyDto;
		empresa_id: number;
	}) {
		if (Number.isNaN(id) || empresa_id != id)
			throw new BadRequestException('Empresa não encontrada');

		return this.prisma.pessoa.update({
			data: {
				nome: updateCompanyDto.nome || undefined,
				cnpj: updateCompanyDto.cnpj || undefined,
				numero: updateCompanyDto.numero || undefined,
				endereco: updateCompanyDto.endereco || undefined,
				cep: updateCompanyDto.cep || undefined,
				bairro: updateCompanyDto.bairro || undefined,
				cidade: updateCompanyDto.cidade || undefined,
				uf: updateCompanyDto.uf || undefined,
			},
			where: {
				id: empresa_id,
			},
		});
	}
}
