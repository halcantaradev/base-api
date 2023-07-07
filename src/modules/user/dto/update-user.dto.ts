import { IsOptional, Validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends CreateUserDto {
	@Validate(null)
	@IsOptional()
	email: string;

	@Validate(null)
	@IsOptional()
	username: string;

	@IsOptional()
	nome: string;

	@IsOptional()
	password: string;

	@IsOptional()
	cargo_id: number;

	@IsOptional()
	ativo: boolean;

	@IsOptional()
	departamentos: number[];

	@IsOptional()
	condominios: number[];
}
