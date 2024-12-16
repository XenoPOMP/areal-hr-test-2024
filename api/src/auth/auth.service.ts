import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service'; // Путь к UserService
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(user: any, req: any): Promise<any> {
    req.session.user = {
      id: user.id,
      login: user.login,
    };
    return { message: 'Login successful', user_id: user.id };
  }

  async logout(req: any): Promise<any> {
    req.session.destroy();
    return { message: 'Logout successful' };
  }

  // Метод для проверки пользователя по логину и паролю
  async validateUser(login: string, password: string, session: any) {
    const db_user = await this.userService.findByLogin(login);
    if (!db_user) {
      console.log(`Пользователь с логином ${login} не найден`);
      return null;
    }

    const isPasswordValid = await argon2.verify(db_user.password, password);
    if (!isPasswordValid) {
      console.log(`Неверный пароль для пользователя ${login}`);
      return null;
    }

    console.log(`Пользователь ${login} успешно прошел проверку`);
    session.user = db_user;

    const { password: _, ...userWithoutPassword } = db_user.toJSON();
    return userWithoutPassword;
  }
}
