import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpStatus,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ReturnNotificationEntity } from './entities/return-notification.entity';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cria uma nova notificação' })
  @ApiResponse({
    description: 'Notificação criada com sucesso',
    status: HttpStatus.OK,
    type: () => ReturnEntity.success(),
  })
  @ApiResponse({
    description: 'Ocorreu um erro ao validar os campos enviados',
    status: HttpStatus.BAD_REQUEST,
    type: ReturnEntity.error,
  })
  @ApiResponse({
    description: 'Ocorreu um erro ao criar a notificação',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ReturnEntity.error,
  })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Lista as notificação' })
  @ApiResponse({
    description: 'Notificações listadas com sucesso',
    status: HttpStatus.OK,
  })
  @ApiResponse({
    description: 'Ocorreu um erro ao listar as notificações',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ReturnEntity.error,
  })
  findAll() {
    return this.notificationService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Lista os dados de uma notificação' })
  @ApiResponse({
    description: 'Notificação listada com sucesso',
    status: HttpStatus.OK,
    type: () => ReturnNotificationEntity,
  })
  @ApiResponse({
    description: 'Ocorreu um erro ao listar os dados da notificação',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: () => ReturnEntity,
  })
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Atualiza os dados de uma notificação' })
  @ApiResponse({
    description: 'Notificação atualizada com sucesso',
    status: HttpStatus.OK,
    type: () => ReturnNotificationEntity,
  })
  @ApiResponse({
    description: 'Ocorreu um erro ao validar os campos enviados',
    status: HttpStatus.BAD_REQUEST,
    type: ReturnEntity.error,
  })
  @ApiResponse({
    description: 'Ocorreu um erro ao atualizar a notificação',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: () => ReturnEntity,
  })
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.update(+id, updateNotificationDto);
  }
}
