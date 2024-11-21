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
    @InjectModel(Passport) private passportModel: typeof Passport,
    @InjectModel(Address) private addressModel: typeof Address,
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

  async createEmployee(employeeData: any) {
    const transaction = await this.sequelize.transaction();

    try {
      const employee = await this.employeeModel.create(employeeData, {
        transaction,
      });

      const passport = await this.passportModel.create(
        { ...employeeData.passport, id: employee.id },
        { transaction },
      );

      const address = await this.addressModel.create(
        { ...employeeData.address, id: employee.id },
        { transaction },
      );

      await transaction.commit();
      return employee;
    } catch (error) {
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
