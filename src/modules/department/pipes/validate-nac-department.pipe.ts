import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { CreateDepartmentDto } from '../dto/create-department.dto';

@Injectable()
export class ValidationNacDepartmentPipe implements PipeTransform {
	transform(createDepartmentDto: CreateDepartmentDto) {
		if (createDepartmentDto.nac && createDepartmentDto.externo)
			throw new BadRequestException(
				'O departamento não pode ser um NAC e um departamento externo',
			);
		else return createDepartmentDto;
	}
}
