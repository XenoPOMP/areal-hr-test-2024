import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findByLogin(login: string) {
    return this.userModel.findOne({
      where: { login },
    });
  }

  async createUser(login: string, password: string) {
    const existingUser = await this.findByLogin(login);
    if (existingUser) {
      throw new BadRequestException(
        'Пользователь с таким логином уже существует',
      );
    }

    const hashedPassword = await argon2.hash(password);

    const newUser = await this.userModel.create({
      login,
      password: hashedPassword,
    });

    return newUser;
  }

  async updateUser(id: number, updateData: Partial<User>) {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`Пользователь с id ${id} не найден`);
    }

    if (updateData.password) {
      updateData.password = await argon2.hash(updateData.password);
    }

    await user.update(updateData);
    return user;
  }

  async deactivateUser(id: number) {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`Пользователь с id ${id} не найден`);
    }

    await user.update({ deleted_at: new Date() });
    return user;
  }
}
