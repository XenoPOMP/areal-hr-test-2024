import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service'; // Путь к UserService
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  // Метод для проверки пользователя по логину и паролю
  async validateUser(login: string, password: string, session: any) {
    const db_user = await this.userService.findByLogin(login);
    if (!db_user) {
      return null;
    }

    const isPasswordValid = await argon2.verify(db_user.password, password);
    if (!isPasswordValid) {
      return null;
    }

    session.user = db_user; // Сохраняем пользователя в сессии

    const { password: _, ...userWithoutPassword } = db_user.toJSON();
    return userWithoutPassword;
  }
}
