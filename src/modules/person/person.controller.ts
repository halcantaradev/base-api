import { Controller } from '@nestjs/common';
import { PersonService } from './person.service';

@Controller('pessoa')
export class PersonController {
	constructor(private readonly pessoaService: PersonService) {}
}