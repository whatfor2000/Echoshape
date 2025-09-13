import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [RegisterController],
  providers: [RegisterService, PrismaService],
})
export class RegisterModule { }
