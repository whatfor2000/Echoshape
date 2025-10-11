import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}
  // เพิ่มเข้ามา
  @UseGuards(JwtAuthGuard)
  @Get("profile")
  async profile(@Req() req) {
    //console.log(req.user.Id);
    return this.userService.getProfile(req.user.Id);
  }
}