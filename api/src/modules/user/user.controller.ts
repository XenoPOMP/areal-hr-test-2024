import { Controller, Put, Param, Body, UseGuards } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { RolesGuard } from 'guards/roles.guard';
import { User } from 'src/models/user.model';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Обновление данных пользователя
  @Put(':id')
  @UseGuards(RolesGuard)
  async updateUser(@Param('id') id: number, @Body() updateData: Partial<User>) {
    return this.userService.updateUser(id, updateData);
  }

  // Деактивация пользователя (мягкое удаление)
  @Put(':id/deactivate')
  @UseGuards(RolesGuard)
  async deactivateUser(@Param('id') id: number) {
    return this.userService.deactivateUser(id);
  }
}
