import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { Request as ExpressRequest } from 'express'; // Импортируем Request из express
import { LocalAuthGuard } from 'src/guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(LocalAuthGuard) // Используем Guard для маршрута
  @Post('login')
  async login(@Request() req: ExpressRequest): Promise<any> {
    if (!req.user || !req.user.id || !req.user.login) {
      throw new Error('Invalid user data');
    }

    req.session.user = req.user; // Сохраняем пользователя в сессии
    return { message: 'Login successful', user: req.user };
  }

  @Post('logout')
  async logout(@Request() req: ExpressRequest): Promise<any> {
    req.session.destroy((err) => {
      if (err) {
        throw new Error('Failed to destroy session');
      }
    });
    return { message: 'Logout successful' };
  }

  @Get('session') // Используем GET вместо POST
  async getSession(@Request() req: ExpressRequest): Promise<any> {
    if (req.session.user) {
      return { user: req.session.user };
    }
    return { message: 'No active session' };
  }
}
