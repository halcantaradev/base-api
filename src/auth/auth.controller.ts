import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../shared/guards/auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginEntity } from './entities/login.entity';
import { TokenEntity } from 'src/shared/entities/token.entity';
import { RequestEntity } from 'src/shared/entities/request.entity';
import { HttpExceptionFilter } from 'src/shared/filters/http-exception-filter';

@ApiTags('Auth')
@Controller('auth')
@UseFilters(new HttpExceptionFilter())
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realiza a autênticação do usuário' })
  @ApiResponse({
    description: 'Usuário autenticado com sucesso',
    status: HttpStatus.OK,
    type: LoginEntity,
  })
  @ApiResponse({
    description: 'Ocorreu um erro ao validar os campos enviados',
    status: HttpStatus.BAD_REQUEST,
  })
  @ApiResponse({
    description: 'Ocorreu um erro ao realizar o login',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  signIn(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto.username, loginDto.password);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Retorna os dados salvos no token do usuário' })
  @ApiResponse({
    description: 'Dados listados com sucesso',
    status: HttpStatus.OK,
    type: TokenEntity,
  })
  @ApiResponse({
    description: 'Ocorreu um erro ao listar os dados',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  getProfile(@Request() req: RequestEntity) {
    return req.token_data;
  }
}