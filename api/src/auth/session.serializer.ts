import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from 'src/models/user.model';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userModel: typeof User) {
    super();
  }

  serializeUser(user: any, done: (err: any, id?: any) => void): void {
    console.log('Serializing user:', user); // Логируем сериализацию
    done(null, user.id); // Сохраняем ID пользователя в сессии
  }

  async deserializeUser(
    id: number,
    done: (err: any, user?: any) => void,
  ): Promise<void> {
    console.log('Deserializing user with ID:', id); // Логируем десериализацию
    const user = await this.userModel.findByPk(id);
    if (!user) {
      return done(null, null);
    }
    done(null, user); // Восстанавливаем пользователя из базы данных
  }
}
