import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { UserService } from '../user/user.service';
import { User } from 'src/models/user.model';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(login: string, password: string): Promise<User | null> {
    const user = await this.userService.findByLogin(login);

    if (!user) {
      return null;
    }

    if (user.deleted_at !== null) {
      return null;
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }
}
