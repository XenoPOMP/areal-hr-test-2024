import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Department } from './department.model';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department)
    private readonly departmentModel: typeof Department,
  ) {}

  async findAll(): Promise<Department[]> {
    return this.departmentModel.findAll();
  }

  async create(dto: CreateDepartmentDto): Promise<Department> {
    return this.departmentModel.create({ ...dto });
  }

  async update(
    id: number,
    dto: UpdateDepartmentDto,
  ): Promise<Department | null> {
    const department = await this.departmentModel.findByPk(id);
    if (department) {
      return department.update({ ...dto });
    }
    return null;
  }

  async remove(id: number): Promise<void> {
    const department = await this.departmentModel.findByPk(id);
    if (department) {
      await department.destroy();
    }
  }
}
