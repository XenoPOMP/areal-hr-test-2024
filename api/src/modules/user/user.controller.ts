import {
  Controller,
  Post,
  Body,
  UseGuards,
  BadRequestException,
  NotFoundException,
  Param,
  Put,
  Get,
  Delete,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { RolesGuard } from 'src/guards/roles.guard';
import { User } from 'src/models/user.model';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(RolesGuard)
  async getAllUsers() {
    const users = await this.userService.findAll();
    if (!users || users.length === 0) {
      throw new NotFoundException('Пользователи не найдены');
    }
    return users;
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  async updateUser(@Param('id') id: number, @Body() updateData: Partial<User>) {
    if (!updateData) {
      throw new BadRequestException('Не переданы данные для обновления');
    }

    const updatedUser = await this.userService.updateUser(id, updateData);

    if (!updatedUser) {
      throw new NotFoundException(`Пользователь с id ${id} не найден`);
    }

    return updatedUser;
  }

  @Post()
  async create(@Body() userData: any) {
    if (!userData.name || !userData.surname) {
      throw new Error('Имя и фамилия обязательны');
    }

    userData.role = 'hr';

    try {
      const user = await this.userService.create(userData);
      return user;
    } catch (error) {
      console.error('Ошибка при добавлении пользователя', error);
      throw error;
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.userService.deactivateUser(Number(id));
    return { message: 'Пользователь удалён' };
  }
}
