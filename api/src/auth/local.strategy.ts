import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from 'auth/auth.service'; // Импортируйте ваш AuthService

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super(); // Вызываем конструктор стратегии
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new Error('Invalid credentials'); // Исключение для неправильных данных
    }
    return user; // Возвращаем данные пользователя после успешной аутентификации
  }
}
