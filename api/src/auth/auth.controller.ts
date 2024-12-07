import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Get,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { LoginDto } from 'auth/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('session')
  getSession(@Session() session: any) {
    if (session.user) {
      return { user: session.user }; // Если сессия существует, возвращаем информацию о пользователе
    } else {
      return { message: 'No active session' }; // Если сессия не существует
    }
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Session() session: any,
    @Res() res: Response,
  ) {
    const { login, password } = loginDto;

    const user = await this.authService.validateUser(login, password, session);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Редирект на страницу OrganizationsPage после успешной авторизации
    return res.redirect('http://localhost:9000/organizations');
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Ошибка при выходе' });
      }
      res.clearCookie('connect.sid'); // Очищаем куку сессии
      res.json({ message: 'Выход успешен' });
    });
  }
}
