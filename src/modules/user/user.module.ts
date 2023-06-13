import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/shared/services/prisma.service';
import { UsernameNotExists, EmailNotExists, CargoExists } from './validators';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    // Validators
    UsernameNotExists,
    EmailNotExists,
    CargoExists,
  ],
  exports: [UserService],
})
export class UserModule {}
