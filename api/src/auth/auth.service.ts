import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(login: string, password: string): Promise<any> {
    const user = await this.userService.findByLogin(login); // Используем login
    if (user && user.password === password) {
      return user; // Возвращаем пользователя при успешной авторизации
    }
    return null; // Неправильные данные
  }
}
