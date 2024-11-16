import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { PassportsService } from './passports.service';
import { CreatePassportDto } from './dto/create-passport.dto';
import { UpdatePassportDto } from './dto/update-passport.dto';
import { Passport } from './passport.model';

@Controller('passports')
export class PassportsController {
  constructor(private readonly passportsService: PassportsService) {}

  // Получить паспорт по ID сотрудника
  @Get(':id')
  async getPassport(@Param('id') id: number): Promise<Passport> {
    const passport = await this.passportsService.findByEmployeeId(id);
    if (!passport) {
      throw new NotFoundException('Паспорт не найден');
    }
    return passport;
  }

  // Создать новый паспорт для сотрудника
  @Post(':id')
  async createPassport(
    @Param('id') id: number,
    @Body() createDto: CreatePassportDto,
  ): Promise<Passport> {
    return this.passportsService.create(id, createDto);
  }

  // Обновить паспорт сотрудника
  @Put(':id')
  async updatePassport(
    @Param('id') id: number,
    @Body() updateDto: UpdatePassportDto,
  ): Promise<Passport> {
    const passport = await this.passportsService.update(id, updateDto);
    if (!passport) {
      throw new NotFoundException('Паспорт не найден');
    }
    return passport;
  }

  // Удалить паспорт сотрудника
  @Delete(':id')
  async removePassport(@Param('id') id: number): Promise<void> {
    const passport = await this.passportsService.findByEmployeeId(id);
    if (!passport) {
      throw new NotFoundException('Паспорт не найден');
    }
    return this.passportsService.remove(id);
  }
}
