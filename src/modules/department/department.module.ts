import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { PrismaService } from 'src/shared/services/prisma.service';

@Module({
	controllers: [DepartmentController],
	providers: [DepartmentService, PrismaService],
})
export class DepartmentModule {}