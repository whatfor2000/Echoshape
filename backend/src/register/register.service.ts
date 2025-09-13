import { Injectable } from '@nestjs/common';
import { CreateRegisterDto } from './dto/create-register.dto';
import { UpdateRegisterDto } from './dto/update-register.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RegisterService {
  constructor(private prisma: PrismaService) { }
  async create(createRegisterDto: CreateRegisterDto) {
    const res = await this.prisma.user.create({ data: createRegisterDto })
    return res.id;
  }

}
