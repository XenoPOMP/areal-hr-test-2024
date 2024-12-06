import {
  Controller,
  Post,
  Body,
  UseGuards,
  Put,
  Param,
  SetMetadata,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RolesGuard } from 'guards/roles.guard';
import { User } from 'models/user.model';
import { AuthService } from 'src/auth/auth.service';
import { Request as ExpressRequest } from 'express'; // Импортируем тип Request из express

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Controller() // Корневой маршрут
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Request() req: ExpressRequest) {
    const user = await this.authService.validateUser(
      req.body.username,
      req.body.password,
    );
    if (user) {
      return { message: 'Login successful', user };
    }
    return { message: 'Invalid credentials' };
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
