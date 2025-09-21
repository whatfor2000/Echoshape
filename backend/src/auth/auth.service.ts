
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload: any = await this.usersService.findOne(user.email);
    return {
      access_token: this.jwtService.sign({
        id: payload.id
      }),
    };
  }
  
  async loginWithFacebook(fbUser: any) {
    // fbUser: { provider, providerId, email, firstName, lastName, picture }

    // 1. หา user ใน DB จาก email หรือ providerId
    let user = await this.usersService.findByProviderId(fbUser.provider, fbUser.providerId);
    console.log(fbUser);
    // 2. ถ้าไม่เจอ → create user ใหม่
    if (!user) {
        user = await this.usersService.createWithFacebook({
            email: fbUser.email,
            firstName: fbUser.firstName,
            lastName: fbUser.lastName,
            picture: fbUser.picture,
            provider: fbUser.provider,
            providerId: fbUser.providerId,
        });
    }

    // 3. สร้าง JWT token
    const payload = { sub: user.id, email: user.email };
    return {
        access_token: this.jwtService.sign(payload),
    };
}
}

