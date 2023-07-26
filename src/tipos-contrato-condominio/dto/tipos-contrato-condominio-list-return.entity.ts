import { ApiProperty } from '@nestjs/swagger';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { TiposContratoCondominio } from '../entities/tipos-contrato-condominio.entity';

export class TiposContratoCondominioListReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: TiposContratoCondominio,
		isArray: true,
		readOnly: true,
		required: false,
	})
	data: TiposContratoCondominio[];
}
