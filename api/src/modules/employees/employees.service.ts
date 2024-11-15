import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Employee } from './employee.model';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee)
    private readonly employeeModel: typeof Employee,
  ) {}

  async findAll(): Promise<Employee[]> {
    return this.employeeModel.findAll({ include: { all: true } });
  }

  async create(createDto: CreateEmployeeDto): Promise<Employee> {
    const { surname, second_name, name, date_birth, position_id } = createDto;
    return this.employeeModel.create({
      surname,
      second_name,
      name,
      date_birth,
      position_id,
    });
  }

  async findOne(id: number): Promise<Employee | null> {
    return this.employeeModel.findByPk(id, { include: { all: true } });
  }

  async update(
    id: number,
    updateDto: UpdateEmployeeDto,
  ): Promise<Employee | null> {
    const employee = await this.employeeModel.findByPk(id);
    if (employee) {
      return employee.update(updateDto);
    }
    return null;
  }

  async remove(id: number): Promise<void> {
    const employee = await this.employeeModel.findByPk(id);
    if (employee) {
      await employee.destroy();
    }
  }
}
