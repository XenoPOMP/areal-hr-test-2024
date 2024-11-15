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

  // Get passport by employee ID
  @Get(':employeeId')
  async getPassport(
    @Param('employeeId') employeeId: number,
  ): Promise<Passport> {
    const passport = await this.passportsService.findByEmployeeId(employeeId);
    if (!passport) {
      throw new NotFoundException('Passport not found');
    }
    return passport;
  }

  // Create a new passport for an employee
  @Post(':employeeId')
  async createPassport(
    @Param('employeeId') employeeId: number,
    @Body() createDto: CreatePassportDto,
  ): Promise<Passport> {
    return this.passportsService.create(employeeId, createDto);
  }

  // Update an employee's passport
  @Put(':employeeId')
  async updatePassport(
    @Param('employeeId') employeeId: number,
    @Body() updateDto: UpdatePassportDto,
  ): Promise<Passport> {
    const passport = await this.passportsService.update(employeeId, updateDto);
    if (!passport) {
      throw new NotFoundException('Passport not found');
    }
    return passport;
  }

  // Remove an employee's passport
  @Delete(':employeeId')
  async removePassport(@Param('employeeId') employeeId: number): Promise<void> {
    const passport = await this.passportsService.findByEmployeeId(employeeId);
    if (!passport) {
      throw new NotFoundException('Passport not found');
    }
    return this.passportsService.remove(employeeId);
  }
}
