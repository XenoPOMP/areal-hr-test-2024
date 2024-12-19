import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User, // Инжектим модель User
  ) {}

  // Метод для поиска пользователя по логину
  async findByLogin(login: string) {
    return this.userModel.findOne({
      where: { login },
    });
  }

  // Метод для создания нового пользователя
  async createUser(login: string, password: string) {
    const hashedPassword = await argon2.hash(password); // Хэшируем пароль
    const newUser = await this.userModel.create({
      login,
      password: hashedPassword,
    });
    return newUser;
  }

  // Метод для обновления данных пользователя
  async updateUser(id: number, updateData: Partial<User>) {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }

    if (updateData.password) {
      updateData.password = await argon2.hash(updateData.password); // Хэшируем новый пароль
    }

    return user.update(updateData);
  }

  // Метод для деактивации пользователя
  async deactivateUser(id: number) {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }

    return user.update({ deleted_at: new Date() }); // Устанавливаем deleted_at для "деактивации"
  }
}
