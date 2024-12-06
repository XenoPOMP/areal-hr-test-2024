import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user.model'; // Импортируем модель

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User)
    private userModel: typeof User, // Внедряем модель User в репозиторий
  ) {}

  // Метод для поиска пользователя по логину
  async findOneByLogin(login: string): Promise<User | null> {
    return this.userModel.findOne({
      where: { login },
    });
  }

  // Метод для создания нового пользователя
  async createUser(
    name: string,
    surname: string,
    login: string,
    password: string,
    role?: string,
  ): Promise<User> {
    return this.userModel.create({
      name,
      surname,
      login,
      password,
      role,
    });
  }

  // Метод для обновления пароля пользователя
  async updatePassword(id: number, newPassword: string): Promise<User | null> {
    const user = await this.userModel.findByPk(id);
    if (user) {
      user.password = newPassword;
      await user.save();
      return user;
    }
    return null;
  }

  // Метод для пометки пользователя как удалённого
  async softDelete(id: number): Promise<User | null> {
    const user = await this.userModel.findByPk(id);
    if (user) {
      user.deleted_at = new Date(); // Устанавливаем дату удаления
      await user.save();
      return user;
    }
    return null;
  }
}
