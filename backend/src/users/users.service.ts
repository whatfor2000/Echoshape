
import { Injectable } from '@nestjs/common';
import { User, FacebookUser } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async findOne(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email }
    });
  }

  async findById(id: string): Promise<Omit<User, 'password'> | null> {
    return this.prisma.user.findFirst({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
      }
    });
  }
  // ✅ หา FacebookUser ด้วย provider + providerId
  async findByProviderId(provider: string, providerId: string): Promise<FacebookUser | null> {
    return this.prisma.facebookUser.findFirst({
      where: { provider, providerId },
    });
  }

  // ✅ สร้าง FacebookUser ใหม่จาก Facebook
  async createWithFacebook(data: {
    email?: string;
    firstName?: string;
    lastName?: string;
    picture?: string;
    provider: string;
    providerId: string;
    password?: string;
  }): Promise<FacebookUser> {
    return this.prisma.facebookUser.create({
      data: {
        email: data.email,
        username: `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim(),
        picture: data.picture,
        provider: data.provider,
        providerId: data.providerId,
        password: data.password,
      },
    });
  }
}
