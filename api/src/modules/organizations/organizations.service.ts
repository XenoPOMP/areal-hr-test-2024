import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Organisation } from '@models/organization.model';
import { CreateOrganisationDto } from './dto/create-organization.dto';
import { UpdateOrganisationDto } from './dto/update-organization.dto';
import { Sequelize } from 'sequelize-typescript';
import { HistoryOfChangesService } from 'src/modules/history_of_changes/history_of_changes.service';

@Injectable()
export class OrganisationsService {
  constructor(
    @InjectModel(Organisation)
    private readonly organisationModel: typeof Organisation,
    private readonly historyOfChangesService: HistoryOfChangesService,
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(): Promise<Organisation[]> {
    return this.organisationModel.findAll({
      where: {
        deleted_at: null,
      },
    });
  }

  async create(
    createDto: CreateOrganisationDto,
    userId: number,
  ): Promise<Organisation> {
    const transaction = await this.sequelize.transaction();

    try {
      const { name, comment } = createDto;
      const newOrganisation = await this.organisationModel.create(
        {
          name,
          comment,
        },
        { transaction },
      );

      await this.historyOfChangesService.logChange(
        'organisation',
        newOrganisation,
        userId,
        transaction,
      );

      await transaction.commit();

      return newOrganisation;
    } catch (error) {
      await transaction.rollback();
      console.error('Error creating organisation:', error);
      throw new Error(`Error creating organisation: ${error.message}`);
    }
  }

  async findOne(id: number): Promise<Organisation | null> {
    return this.organisationModel.findByPk(id);
  }

  async update(
    id: number,
    dto: UpdateOrganisationDto,
    userId: number,
  ): Promise<Organisation | null> {
    const transaction = await this.sequelize.transaction();

    try {
      const organisation = await this.organisationModel.findByPk(id, {
        transaction,
      });

      if (!organisation) {
        throw new Error('Organisation not found');
      }

      const updatedOrganisation = await organisation.update(dto, {
        transaction,
      });

      await this.historyOfChangesService.logChange(
        'organisation',
        {
          id,
          changes: JSON.stringify(dto),
        },
        userId,
        transaction,
      );

      await transaction.commit();

      return updatedOrganisation;
    } catch (error) {
      await transaction.rollback();
      console.error('Error during organisation update:', error);
      throw new Error(`Error updating organisation: ${error.message}`);
    }
  }

  async softDeleteOrganization(id: number, userId: number): Promise<void> {
    const transaction = await this.sequelize.transaction();

    try {
      const organisation = await this.organisationModel.findByPk(id, {
        transaction,
      });

      if (!organisation) {
        throw new Error('Organisation not found');
      }

      organisation.deleted_at = new Date();
      await organisation.save({ transaction });

      await this.historyOfChangesService.logChange(
        'organisation',
        { id, deleted_at: organisation.deleted_at },
        userId,
        transaction,
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error('Error during organisation soft delete:', error);
      throw new Error(`Error soft-deleting organisation: ${error.message}`);
    }
  }
}
