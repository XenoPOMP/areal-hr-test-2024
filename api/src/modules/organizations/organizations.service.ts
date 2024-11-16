import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Organisation } from '@models/organization.model';
import { CreateOrganisationDto } from './dto/create-organization.dto';
import { UpdateOrganisationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganisationsService {
  constructor(
    @InjectModel(Organisation)
    private readonly organisationModel: typeof Organisation,
  ) {}

  async findAll(): Promise<Organisation[]> {
    return this.organisationModel.findAll();
  }

  // Исправленная версия метода create
  async create(createDto: CreateOrganisationDto): Promise<Organisation> {
    // Передаем данные напрямую без использования dto
    const { name, comment } = createDto;
    return this.organisationModel.create({ name, comment });
  }

  async findOne(id: number): Promise<Organisation | null> {
    return this.organisationModel.findByPk(id);
  }

  async update(
    id: number,
    dto: UpdateOrganisationDto,
  ): Promise<Organisation | null> {
    const organisation = await this.organisationModel.findByPk(id);
    if (organisation) {
      return organisation.update(dto);
    }
    return null;
  }

  async remove(id: number): Promise<void> {
    const organisation = await this.organisationModel.findByPk(id);
    if (organisation) {
      await organisation.destroy();
    }
  }
}
