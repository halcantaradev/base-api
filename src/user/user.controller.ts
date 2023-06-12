import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  HttpStatus,
  Request,
  UseFilters,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { RequestEntity } from 'src/shared/entities/request.entity';
import { UserEntity } from './entities/user.entity';
import { HttpExceptionFilter } from 'src/shared/filters/http-exception-filter';
import { PrismaExceptionFilter } from 'src/shared/filters/prisma-exception-filter';

@ApiTags('User')
@Controller('users')
@UseFilters(HttpExceptionFilter, PrismaExceptionFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiResponse({
    description: 'Usuário criado com sucesso',
    status: HttpStatus.CREATED,
  })
  @ApiResponse({
    description: 'Ocorreu um erro ao criar o usuário',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  create(@Request() req: RequestEntity, @Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto, req.token_data.empresa_id);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Lista todos os usuários' })
  @ApiResponse({
    description: 'Usuários listados com sucesso',
    status: HttpStatus.OK,
    type: UserEntity,
    isArray: true,
  })
  @ApiResponse({
    description: 'Ocorreu um erro ao listar os usuários',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  findAll(@Request() req: RequestEntity) {
    return this.userService.findAll(req.token_data.empresa_id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Lista os dados do usuário' })
  @ApiResponse({
    description: 'Dados do usuário listados com sucesso',
    status: HttpStatus.OK,
    type: UserEntity,
  })
  @ApiResponse({
    description: 'Ocorreu um erro ao listar os dados usuário',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Atualiza os dados do usuário' })
  @ApiResponse({
    description: 'Dados do usuário atualizados com sucesso',
    status: HttpStatus.OK,
    type: UserEntity,
  })
  @ApiResponse({
    description: 'Ocorreu um erro ao atualizar os dados usuário',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  update(
    @Param('id') id: string,
    @Request() req: RequestEntity,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(
      +id,
      req.token_data.empresa_id,
      updateUserDto,
    );
  }
}
