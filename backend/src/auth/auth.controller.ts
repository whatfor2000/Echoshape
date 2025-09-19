import { Controller, Post, UseGuards, Request, Req, Res, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import express from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req, @Res({ passthrough: true }) res: express.Response) {
        try {
            const { access_token } = await this.authService.login(req.body);
            res.cookie('access_token', access_token, {
                httpOnly: true,
            });
            return { success: true, access_token: access_token };

        } catch (error) {
            return { error: `Error ${error}` }
        }
    }

    // ✅ Facebook Login - เริ่ม redirect
    @Get('facebook')
    @UseGuards(AuthGuard('facebook'))
    async facebookLogin() {
        return { msg: 'Redirecting to Facebook...' };
    }

    @Get('facebook/callback')
    @UseGuards(AuthGuard('facebook'))
    async facebookCallback(@Req() req, @Res({ passthrough: true }) res) {
    console.log('✅ req.user from FacebookStrategy:', req.user);
    const { access_token } = await this.authService.loginWithFacebook(req.user);
    console.log('JWT access_token:', access_token);

    res.cookie('access_token', access_token, { httpOnly: true });
    return res.redirect(`http://localhost:5173/FacebookLoginSuccess?token=${access_token}`);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req: any) {
    return req.user; // req.user จาก JwtStrategy.validate
    }
}