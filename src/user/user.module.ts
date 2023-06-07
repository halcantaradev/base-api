import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/shared/services/prisma.service';
import { UserRepository } from './user.repository';
import { UsernameNotExists, EmailNotExists, CargoExists } from './validators';
import { CargoModule } from 'src/cargo/cargo.module';

@Module({
  imports: [CargoModule],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    PrismaService,
    // Validators
    UsernameNotExists,
    EmailNotExists,
    CargoExists,
  ],
  exports: [UserService],
})
export class UserModule {}
