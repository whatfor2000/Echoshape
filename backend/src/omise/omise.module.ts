import { Module } from '@nestjs/common';
import { OmiseController } from './omise.controller';
import { OmiseService } from './omise.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [OmiseController],
    providers: [OmiseService],
    exports: [OmiseService],
})
export class OmiseModule {}