import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { UserController } from '../user/user.controller';
import { User } from 'models/user.model';

@Module({
  imports: [SequelizeModule.forFeature([User]), PassportModule],
  providers: [AuthService, LocalStrategy],
  controllers: [UserController],
})
export class AuthModule {}
