import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Department } from '@models/department.model';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { HistoryOfChangesService } from 'src/modules/history_of_changes/history_of_changes.service';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department)
    private readonly departmentModel: typeof Department,
    private readonly historyOfChangesService: HistoryOfChangesService,
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(): Promise<Department[]> {
    return this.departmentModel.findAll({
      where: {
        deleted_at: null,
      },
    });
  }

  async create(dto: CreateDepartmentDto, user_id: number): Promise<Department> {
    const transaction = await this.sequelize.transaction();
    try {
      const department = await this.departmentModel.create(
        { ...dto },
        { transaction },
      );

      await this.historyOfChangesService.logChange(
        'department',
        dto,
        user_id,
        transaction,
      );

      await transaction.commit();
      return department;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async update(
    id: number,
    dto: UpdateDepartmentDto,
    user_id: number,
  ): Promise<Department | null> {
    const transaction = await this.sequelize.transaction();
    try {
      if (!user_id) {
        throw new Error('user_id отсутствует');
      }

      const department = await this.departmentModel.findByPk(id, {
        transaction,
      });
      if (department) {
        const updated = await department.update({ ...dto }, { transaction });

        await this.historyOfChangesService.logChange(
          'department',
          dto,
          user_id,
          transaction,
        );

        await transaction.commit();
        return updated;
      }

      await transaction.commit();
      return null;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async softDeleteDepartment(id: number, user_id: number): Promise<void> {
    const transaction = await this.sequelize.transaction();
    try {
      const department = await this.departmentModel.findByPk(id, {
        transaction,
      });

      if (!department) {
        throw new Error('Department not found');
      }

      await department.destroy({ transaction });

      await this.historyOfChangesService.logChange(
        'department',
        { id, deleted: true },
        user_id,
        transaction,
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
