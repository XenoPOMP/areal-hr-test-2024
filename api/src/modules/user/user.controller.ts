import {
  Controller,
  Post,
  Body,
  UseGuards,
  Put,
  Param,
  SetMetadata,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RolesGuard } from 'guards/roles.guard';
import { User } from 'models/user.model';

const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @Roles('admin') // Декоратор с ролью admin
  @UseGuards(RolesGuard)
  async register(
    @Body()
    body: {
      name: string;
      surname: string;
      second_name: string;
      login: string;
      password: string;
    },
  ) {
    const { name, surname, second_name, login, password } = body;
    const user = await this.userService.createUser(
      name,
      surname,
      second_name,
      login,
      password,
    );
    return user;
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  async updateUser(@Param('id') id: number, @Body() updateData: Partial<User>) {
    return this.userService.updateUser(id, updateData);
  }

  @Put(':id/deactivate')
  @UseGuards(RolesGuard)
  async deactivateUser(@Param('id') id: number) {
    return this.userService.deactivateUser(id);
  }
}
