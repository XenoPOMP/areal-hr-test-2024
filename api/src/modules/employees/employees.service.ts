import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Employee } from '@models/employee.model';
import { Address } from '@models/address.model';
import { Passport } from '@models/passport.model';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee) private employeeModel: typeof Employee,
    @InjectModel(Address) private addressModel: typeof Address,
    @InjectModel(Passport) private passportModel: typeof Passport,
    private sequelize: Sequelize,
  ) {}

  async getEmployeeWithDetails(id: string) {
    return this.employeeModel.findOne({
      where: { id },
      include: [Address, Passport],
    });
  }
  async findAll() {
    return this.employeeModel.findAll({
      include: [{ model: Passport }, { model: Address }],
    });
  }

  async create(createDto: CreateEmployeeDto): Promise<Employee> {
    const {
      surname,
      second_name,
      name,
      date_birth,
      position_id,
      address,
      passport,
    } = createDto;

    // Начало транзакции
    const transaction = await this.sequelize.transaction();

    try {
      // Создание записи сотрудника
      const employee = await this.employeeModel.create(
        { surname, second_name, name, date_birth, position_id },
        { transaction },
      );

      // Создание записи адреса, связанной с сотрудником
      await this.addressModel.create(
        { ...address, id: employee.id },
        { transaction },
      );

      // Создание записи паспорта, связанной с сотрудником
      await this.passportModel.create(
        { ...passport, id: employee.id },
        { transaction },
      );

      // Подтверждение транзакции
      await transaction.commit();

      return employee;
    } catch (error) {
      // Откат транзакции в случае ошибки
      await transaction.rollback();
      throw error;
    }
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
