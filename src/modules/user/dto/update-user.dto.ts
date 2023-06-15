import { IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends CreateUserDto {
	@IsOptional()
	email: string;

	@IsOptional()
	nome: string;

	@IsOptional()
	password: string;

	@IsOptional()
	cargo_id: number;

	@IsOptional()
	ativo: boolean;
}
