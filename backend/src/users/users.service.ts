
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }
  async findOne(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email: email }
    })
  }

  async findById(id: string): Promise<Omit<User, 'password'> | null> {
    return this.prisma.user.findFirst({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
      }
    })
  }
}
