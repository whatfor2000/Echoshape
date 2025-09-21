import { Controller, Post, UseGuards, Request, Req, Res, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthGuard } from '@nestjs/passport'
import type { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    // login (local)
    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const { access_token } = await this.authService.login(req.user);

    res.cookie('access_token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24,
    });

    return { success: true, message: 'Login success' };
    }

    @Get('facebook')
    @UseGuards(AuthGuard('facebook'))
    async facebookLogin() {
        return { message: 'Redirecting to Facebook...' };
    }

    // facebook callback
    @Get('facebook/callback')
    @UseGuards(AuthGuard('facebook'))
    async facebookCallback(@Req() req, @Res({ passthrough: true }) res: Response) {
    const { access_token } = await this.authService.loginWithFacebook(req.user);

    res.cookie('access_token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24,
    });

    return res.redirect('http://localhost:5173/FacebookLoginSuccess');
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req) {
    return req.user; // ข้อมูล user จาก JWT
    }

    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { success: true };
    }


}