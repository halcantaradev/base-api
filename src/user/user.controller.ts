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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { RequestEntity } from 'src/shared/entities/request.entity';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ReturnUserEntity } from './entities/return-user.entity';
import { ReturnUserListEntity } from './entities/return-user-list.entity';

@ApiTags('User')
@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiResponse({
    description: 'Usuário criado com sucesso',
    status: HttpStatus.CREATED,
    type: ReturnEntity.success(),
  })
  @ApiResponse({
    description: 'Ocorreu um erro ao criar o usuário',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ReturnEntity.error(),
  })
  create(@Request() req: RequestEntity, @Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto, req.token_data.empresa_id);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os usuários' })
  @ApiResponse({
    description: 'Usuários listados com sucesso',
    status: HttpStatus.OK,
    type: ReturnUserListEntity,
  })
  @ApiResponse({
    description: 'Ocorreu um erro ao listar os usuários',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ReturnEntity.error(),
  })
  findAll(@Request() req: RequestEntity) {
    return this.userService.findAll(req.token_data.empresa_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lista os dados do usuário' })
  @ApiResponse({
    description: 'Dados do usuário listados com sucesso',
    status: HttpStatus.OK,
    type: ReturnUserEntity,
  })
  @ApiResponse({
    description: 'Ocorreu um erro ao listar os dados usuário',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ReturnEntity.error(),
  })
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza os dados do usuário' })
  @ApiResponse({
    description: 'Dados do usuário atualizados com sucesso',
    status: HttpStatus.OK,
    type: ReturnUserEntity,
  })
  @ApiResponse({
    description: 'Ocorreu um erro ao atualizar os dados usuário',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ReturnEntity.error(),
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
