import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async validateUser(login: string, password: string) {
    const user = await this.userModel.findOne({ where: { login } });
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const { password: _, ...result } = user.toJSON();
    return result;
  }
}
