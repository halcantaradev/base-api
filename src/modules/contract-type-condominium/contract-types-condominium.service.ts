import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateContractTypesCondominiumDto } from './dto/create-contract-types-condominium.dto';
import { UpdateContractTypesCondominiumDto } from './dto/update-contract-types-condominium.dto';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { Pagination } from 'src/shared/entities/pagination.entity';
import { FiltersContractTypesCondominiumDto } from './dto/filters-contract-types-condominium.dto';

@Injectable()
export class ContractTypesCondominiumService {
	constructor(private readonly prismaServices: PrismaService) {}

	async create(
		createContractTypesCondominiumDto: CreateContractTypesCondominiumDto,
	) {
		return this.prismaServices.tipoContratoCondominio.create({
			data: createContractTypesCondominiumDto,
		});
	}

	async findAll(
		filtersContractTypesCondominiumDto: FiltersContractTypesCondominiumDto,
		pagination?: Pagination,
	) {
		const tiposContrato =
			await this.prismaServices.tipoContratoCondominio.findMany({
				where: {
					OR: filtersContractTypesCondominiumDto.busca
						? [
								{
									nome: {
										contains:
											filtersContractTypesCondominiumDto.busca,
										mode: 'insensitive',
									},
								},
								!Number.isNaN(
									+filtersContractTypesCondominiumDto.busca,
								)
									? {
											id: +filtersContractTypesCondominiumDto.busca,
									  }
									: null,
						  ]
						: undefined,
					ativo:
						filtersContractTypesCondominiumDto.ativo != null
							? filtersContractTypesCondominiumDto.ativo
							: undefined,
				},
				take: 20,
				skip: pagination?.page
					? (pagination?.page - 1) * 20
					: undefined,
			});

		const total_pages =
			await this.prismaServices.tipoContratoCondominio.count();

		return { data: tiposContrato, total_pages };
	}

	findOne(id: number) {
		return this.prismaServices.tipoContratoCondominio.findFirst({
			where: {
				id,
			},
		});
	}

	async update(
		id: number,
		updateContractTypesCondominiumDto: UpdateContractTypesCondominiumDto,
	) {
		const tipoContrato =
			await this.prismaServices.tipoContratoCondominio.findFirst({
				where: {
					id,
				},
			});

		if (!tipoContrato)
			throw new BadRequestException('Tipo de contrato não encontrado');

		return this.prismaServices.tipoContratoCondominio.update({
			data: updateContractTypesCondominiumDto,
			where: {
				id,
			},
		});
	}
}
