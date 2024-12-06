import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { UserModule } from 'modules/user/user.module';

@Module({
  imports: [forwardRef(() => UserModule)], // forwardRef для избегания круговой зависимости
  providers: [AuthService, LocalAuthGuard],
  controllers: [AuthController],
  exports: [AuthService], // Экспортируем AuthService
})
export class AuthModule {}
