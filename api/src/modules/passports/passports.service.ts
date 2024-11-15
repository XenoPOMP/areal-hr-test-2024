import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Passport } from './passport.model';
import { CreatePassportDto } from './dto/create-passport.dto';
import { UpdatePassportDto } from './dto/update-passport.dto';

@Injectable()
export class PassportsService {
  constructor(
    @InjectModel(Passport)
    private readonly passportModel: typeof Passport,
  ) {}

  async findAll(): Promise<Passport[]> {
    return this.passportModel.findAll();
  }

  // Find passport by employee ID
  async findByEmployeeId(employeeId: number): Promise<Passport | null> {
    return this.passportModel.findOne({ where: { employeeId } });
  }

  // Create passport for an employee
  async create(
    employeeId: number,
    createDto: CreatePassportDto,
  ): Promise<Passport> {
    return this.passportModel.create({ ...createDto, employeeId });
  }

  // Update passport for an employee
  async update(
    employeeId: number,
    updateDto: UpdatePassportDto,
  ): Promise<Passport | null> {
    const passport = await this.findByEmployeeId(employeeId);
    return passport ? passport.update(updateDto) : null;
  }

  // Remove passport by employee ID
  async remove(employeeId: number): Promise<void> {
    const passport = await this.findByEmployeeId(employeeId);
    if (passport) {
      await passport.destroy();
    }
  }
}
