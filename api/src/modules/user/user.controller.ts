import {
  Controller,
  Put,
  Param,
  Body,
  UseGuards,
  NotFoundException,
  BadRequestException,
  Get,
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

  @Put(':id/deactivate')
  @UseGuards(RolesGuard)
  async deactivateUser(@Param('id') id: number) {
    const deactivatedUser = await this.userService.deactivateUser(id);

    if (!deactivatedUser) {
      throw new NotFoundException(`Пользователь с id ${id} не найден`);
    }

    return deactivatedUser;
  }
}
