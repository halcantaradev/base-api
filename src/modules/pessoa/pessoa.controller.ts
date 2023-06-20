import { Controller } from '@nestjs/common';
import { PessoaService } from './pessoa.service';

@Controller('pessoa')
export class PessoaController {
	constructor(private readonly pessoaService: PessoaService) {}
}
