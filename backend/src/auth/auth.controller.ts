import { Controller, Post, UseGuards, Request, Res, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import express from 'express';

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

    // ✅ Facebook Login - callback หลังสำเร็จ
    @Get('facebook/callback')
    @UseGuards(AuthGuard('facebook'))
    async facebookCallback(@Request() req, @Res({ passthrough: true }) res: express.Response) {
        const fbUser = req.user; // ได้มาจาก FacebookStrategy.validate()
        
        // 👉 เอา fbUser ไปเช็ค/สร้าง user ใน DB จากนั้นออก token
        const { access_token } = await this.authService.loginWithFacebook(fbUser);

        // set cookie
        res.cookie('access_token', access_token, { httpOnly: true });

        // redirect กลับ frontend พร้อม token
        return res.redirect(`http://localhost:5173/login/success?token=${access_token}`);
    }
}