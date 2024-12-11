import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Department } from '@models/department.model';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { HistoryOfChangesService } from 'src/modules/history_of_changes/history_of_changes.service';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department)
    private readonly departmentModel: typeof Department,
    private readonly historyOfChangesService: HistoryOfChangesService,
  ) {}

  async findAll(): Promise<Department[]> {
    return this.departmentModel.findAll({
      where: {
        deleted_at: null,
      },
    });
  }

  async create(dto: CreateDepartmentDto, userId: number): Promise<Department> {
    const department = await this.departmentModel.create({ ...dto });
    await this.historyOfChangesService.logChange('department', dto, userId);
    return department;
  }

  async update(
    id: number,
    dto: UpdateDepartmentDto,
    userId: number,
  ): Promise<Department | null> {
    const department = await this.departmentModel.findByPk(id);
    if (department) {
      const updated = await department.update({ ...dto });
      await this.historyOfChangesService.logChange('department', dto, userId);
      return updated;
    }
    return null;
  }

  async softDeleteDepartment(id: number, userId: number): Promise<void> {
    const department = await Department.findByPk(id);

    if (!department) {
      throw new Error('Department not found');
    }

    department.deleted_at = new Date();
    await department.save();
    await this.historyOfChangesService.logChange(
      'department',
      { id, deleted: true },
      userId,
    );
  }
}
