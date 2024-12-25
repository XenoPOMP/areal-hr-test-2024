import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HrAction } from '@models/hr_action.model';
import { CreateHrActionDto } from './dto/create-hr_action.dto';
import { UpdateHrActionDto } from './dto/update-hr_action.dto';
import { Sequelize } from 'sequelize-typescript';
import { HistoryOfChangesService } from 'src/modules/history_of_changes/history_of_changes.service';

@Injectable()
export class HrActionsService {
  constructor(
    @InjectModel(HrAction)
    private readonly hrActionModel: typeof HrAction,
    private readonly historyOfChangesService: HistoryOfChangesService, // Логирование
    private sequelize: Sequelize,
  ) {}

  async findAll(): Promise<HrAction[]> {
    return this.hrActionModel.findAll({
      where: {
        deleted_at: null,
      },
    });
  }

  async findOne(id: number): Promise<HrAction | null> {
    return this.hrActionModel.findByPk(id);
  }

  async create(
    createDto: CreateHrActionDto,
    userId: number,
  ): Promise<HrAction> {
    const transaction = await this.sequelize.transaction();

    try {
      const action = await this.hrActionModel.create(
        {
          action_type: createDto.action_type,
          date: createDto.date,
          salary: createDto.salary,
          employee_id: createDto.employee_id,
          department_id: createDto.department_id,
          position_id: createDto.position_id,
        },
        { transaction },
      );

      await this.historyOfChangesService.logChange(
        'hr_action',
        action,
        userId,
        transaction,
      );

      await transaction.commit();
      return action;
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Error during HR action creation: ${error.message}`);
    }
  }

  async update(
    id: number,
    dto: UpdateHrActionDto,
    userId: number,
  ): Promise<HrAction | null> {
    const transaction = await this.sequelize.transaction();
    try {
      const action = await this.hrActionModel.findByPk(id, { transaction });

      if (!action) {
        throw new NotFoundException(`HR action with ID ${id} not found`);
      }

      const updatedAction = await action.update(dto, { transaction });

      await this.historyOfChangesService.logChange(
        'hr_action',
        updatedAction,
        userId,
        transaction,
      );

      await transaction.commit();
      return updatedAction;
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Error during HR action update: ${error.message}`);
    }
  }

  async softDeleteHrAction(id: number, userId: number): Promise<void> {
    const transaction = await this.sequelize.transaction();
    try {
      const action = await this.hrActionModel.findByPk(id, { transaction });

      if (!action) {
        throw new NotFoundException(`HR action with ID ${id} not found`);
      }

      await action.destroy({ transaction });

      await this.historyOfChangesService.logChange(
        'hr_action',
        { id, deleted_at: new Date() },
        userId,
        transaction,
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Error during HR action deletion: ${error.message}`);
    }
  }
}
