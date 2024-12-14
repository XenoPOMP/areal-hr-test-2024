import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HrAction } from '@models/hr_action.model';
import { CreateHrActionDto } from './dto/create-hr_action.dto';
import { UpdateHrActionDto } from './dto/update-hr_action.dto';
import { HistoryOfChangesService } from 'src/modules/history_of_changes/history_of_changes.service';

@Injectable()
export class HrActionsService {
  constructor(
    @InjectModel(HrAction)
    private readonly hrActionModel: typeof HrAction,
    private readonly historyOfChangesService: HistoryOfChangesService, // Логирование
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
    const action = await this.hrActionModel.create({
      action_type: createDto.action_type,
      date: createDto.date,
      salary: createDto.salary,
      employee_id: createDto.employee_id,
      department_id: createDto.department_id,
      position_id: createDto.position_id,
    });

    // Логирование
    await this.historyOfChangesService.logChange('hr_action', action, userId);

    return action;
  }

  async update(
    id: number,
    dto: UpdateHrActionDto,
    userId: number,
  ): Promise<HrAction | null> {
    const action = await this.hrActionModel.findByPk(id);
    if (action) {
      const updatedAction = await action.update(dto);

      // Логирование
      await this.historyOfChangesService.logChange(
        'hr_action',
        updatedAction,
        userId,
      );

      return updatedAction;
    }
    return null;
  }

  async softDeleteHrAction(id: number, userId: number): Promise<void> {
    const action = await HrAction.findByPk(id);

    if (!action) {
      throw new Error('HR action not found');
    }

    action.deleted_at = new Date();
    await action.save();

    // Логирование удаления
    await this.historyOfChangesService.logChange(
      'hr_action',
      { id, deleted_at: new Date() },
      userId,
    );
  }
}
