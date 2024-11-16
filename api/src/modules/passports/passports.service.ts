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

  async findByEmployeeId(id: number): Promise<Passport | null> {
    // Используем id как ключ для поиска связанного паспорта
    return this.passportModel.findOne({ where: { id } });
  }

  async create(id: number, dto: CreatePassportDto): Promise<Passport> {
    return this.passportModel.create({ id, ...dto });
  }

  async update(id: number, dto: UpdatePassportDto): Promise<Passport | null> {
    const passport = await this.findByEmployeeId(id);
    if (passport) {
      return passport.update({ ...dto });
    }
    return null;
  }

  async remove(id: number): Promise<void> {
    const passport = await this.findByEmployeeId(id);
    if (passport) {
      await passport.destroy();
    }
  }
}
