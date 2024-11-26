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
import { Passport } from '@models/passport.model';

@Controller('passports')
export class PassportsController {
  constructor(private readonly passportsService: PassportsService) {}

  @Get()
  async findAll(): Promise<Passport[]> {
    return this.passportsService.findAll();
  }

  @Get(':id')
  async getPassport(@Param('id') id: number): Promise<Passport> {
    const passport = await this.passportsService.findByEmployeeId(id);
    if (!passport) {
      throw new NotFoundException('Паспорт не найден');
    }
    return passport;
  }

  @Post()
  async create(@Body() createDto: CreatePassportDto): Promise<Passport> {
    return this.passportsService.create(createDto);
  }

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

  @Delete(':id')
  async softDeletePassport(@Param('id') id: number) {
    await this.passportsService.softDeletePassport(id);
    return;
  }
}
