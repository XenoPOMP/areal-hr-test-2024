import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from 'src/models/user.model';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userModel: typeof User) {
    super();
  }

  serializeUser(user: any, done: (err: any, id?: any) => void): void {
    done(null, user.id); // Сериализация только ID пользователя
  }

  async deserializeUser(
    id: number,
    done: (err: any, user?: any) => void,
  ): Promise<void> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      return done(null, null);
    }
    done(null, user); // Восстановление пользователя по ID
  }
}
