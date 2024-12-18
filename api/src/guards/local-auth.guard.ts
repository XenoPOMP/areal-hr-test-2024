import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { LoginDto } from 'src/modules/auth/dto/login.dto'; // Импортируем LoginDto

@Injectable()
export class LocalAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const loginDto: LoginDto = request.body; // Получаем данные из запроса и создаем DTO

    // Используем DTO для проверки пользователя
    const db_user = await this.authService.validateUser(
      //todo passport
      loginDto.login,
      loginDto.password,
      {}, // Сессия не требуется в этом гварде, оставляем пустым
    );

    return !!db_user; // Если пользователь найден и аутентифицирован, возвращаем true, иначе false
  }
}
