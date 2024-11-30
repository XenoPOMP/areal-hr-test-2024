import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as argon2 from 'argon2';
import { User } from 'models/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async getAllUsers() {
    return this.userModel.findAll({ where: { deleted_at: null } });
  }

  async createUser(
    name: string,
    surname: string,
    second_name: string,
    login: string,
    password: string,
    role: string = 'user',
  ) {
    const hashedPassword = await argon2.hash(password);
    const user = await this.userModel.create({
      name,
      surname,
      second_name,
      login,
      password: hashedPassword,
      role,
    });

    return user;
  }

  async findByLogin(login: string) {
    return this.userModel.findOne({ where: { login } });
  }

  async updateUser(id: number, updateData: Partial<User>) {
    const user = await this.userModel.findByPk(id);
    if (user) {
      return user.update(updateData);
    }
    return null;
  }

  async deactivateUser(id: number) {
    const user = await this.userModel.findByPk(id);
    if (user) {
      return user.update({ deleted_at: new Date() });
    }
    return null;
  }
}
