import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from 'src/modules/auth/dto/login.dto'; // Импортируем LoginDto

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'login', passwordField: 'password' }); // Указываем поля для логина и пароля
  }

  async validate(login: string, password: string): Promise<any> {
    const loginDto: LoginDto = { login, password }; // Создаем DTO из данных
    const user = await this.authService.validateUser(
      loginDto.login,
      loginDto.password,
      {},
    ); // Передаем DTO в метод validateUser
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user; // Возвращаем пользователя, если он найден
  }
}
