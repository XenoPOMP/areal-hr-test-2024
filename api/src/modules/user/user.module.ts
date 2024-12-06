import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { User } from 'src/models/user.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([User]), forwardRef(() => AuthModule)], // forwardRef для избежания круговой зависимости
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository], // Экспортируем UserService
})
export class UserModule {}
