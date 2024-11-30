import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'models/user.model';
import { AuthService } from './auth.service';
import { UserModule } from './user.module';

@Module({
  imports: [SequelizeModule.forFeature([User]), forwardRef(() => UserModule)],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
