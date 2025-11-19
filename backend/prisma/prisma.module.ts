import { Module, Global } from '@nestjs/common';
import { PrismaService } from '../src/prisma.service';

@Global() // ทำให้ import ครั้งเดียวใช้ได้ทั่ว project
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}