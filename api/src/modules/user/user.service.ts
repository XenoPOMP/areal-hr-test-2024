import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import * as argon2 from 'argon2';
import { CreateUserDto } from 'modules/user/dto/create-user.dto';

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

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await argon2.hash(createUserDto.password, {
      type: argon2.argon2id,
    });

    const user = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return user;
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
