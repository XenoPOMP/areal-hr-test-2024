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
import { AuthService } from './auth.service';

const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() body: { login: string; password: string }) {
    const { login, password } = body;
    const user = await this.authService.validateUser(login, password);
    return { message: 'Login successful', user };
  }

  @Post('register')
  @Roles('admin')
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
