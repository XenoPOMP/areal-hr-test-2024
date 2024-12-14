import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Organisation } from '@models/organization.model';
import { CreateOrganisationDto } from './dto/create-organization.dto';
import { UpdateOrganisationDto } from './dto/update-organization.dto';
import { HistoryOfChangesService } from 'src/modules/history_of_changes/history_of_changes.service';

@Injectable()
export class OrganisationsService {
  constructor(
    @InjectModel(Organisation)
    private readonly organisationModel: typeof Organisation,
    private readonly historyOfChangesService: HistoryOfChangesService,
  ) {}

  async findAll(): Promise<Organisation[]> {
    return this.organisationModel.findAll({
      where: {
        deleted_at: null,
      },
    });
  }

  async create(createDto: CreateOrganisationDto): Promise<Organisation> {
    const { name, comment } = createDto;
    const newOrganisation = await this.organisationModel.create({
      name,
      comment,
    });

    return newOrganisation;
  }

  async findOne(id: number): Promise<Organisation | null> {
    return this.organisationModel.findByPk(id);
  }

  async update(
    id: number,
    dto: UpdateOrganisationDto,
    userId: number,
  ): Promise<Organisation | null> {
    const organisation = await this.organisationModel.findByPk(id);

    if (organisation) {
      const updatedOrganisation = await organisation.update(dto);

      await this.historyOfChangesService.logChange(
        'organisation',
        {
          id,
          changes: JSON.stringify(dto),
        },
        userId,
      );

      return updatedOrganisation;
    }

    return null;
  }

  async softDeleteOrganization(id: number): Promise<void> {
    const organisation = await Organisation.findByPk(id);

    if (!organisation) {
      throw new Error('Organization not found');
    }

    organisation.deleted_at = new Date();
    await organisation.save();
  }
}
