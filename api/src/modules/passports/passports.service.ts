import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Passport } from '@models/passport.model';
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

  async findByEmployeeId(id: number): Promise<Passport | null> {
    return this.passportModel.findOne({ where: { id } });
  }

  async create(dto: CreatePassportDto): Promise<Passport> {
    return this.passportModel.create({ ...dto });
  }

  async update(id: number, dto: UpdatePassportDto): Promise<Passport | null> {
    const passport = await this.findByEmployeeId(id);
    if (passport) {
      return passport.update({ ...dto });
    }
    return null;
  }

  async softDeletePassport(id: number): Promise<void> {
    const passport = await Passport.findByPk(id);

    if (!passport) {
      throw new Error('Department not found');
    }

    passport.deleted_at = new Date();
    await passport.save();
  }
}
