import { Controller, Post, UseGuards, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
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
}