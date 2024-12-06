import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from 'guards/local-auth.guard'; // Импортируем ваш кастомный Guard
import { Request as ExpressRequest } from 'express'; // Импортируем тип Request из express

@Controller('auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: ExpressRequest) {
    // req.user будет содержать данные пользователя после успешной аутентификации
    return { message: 'Login successful', user: req.user };
  }

  @Post('logout')
  logout(@Request() req: ExpressRequest) {
    return new Promise((resolve, reject) => {
      req.logout((err: any) => {
        if (err) {
          console.error(err);
          return reject({ message: 'Logout failed', error: err });
        }
        resolve({ message: 'Logout successful' });
      });
    });
  }

  @Get('session')
  session(@Request() req: ExpressRequest) {
    if (req.isAuthenticated()) {
      return { user: req.user };
    }
    return { message: 'Not authenticated' };
  }
}
