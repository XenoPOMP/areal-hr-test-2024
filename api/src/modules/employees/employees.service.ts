import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll() {
    return this.employeeModel.findAll({
      include: [
        { model: Passport, as: 'passport' },
        { model: Address, as: 'address' },
      ],
      where: {
        deleted_at: null,
      },
    });
  }

  async getEmployeeWithDetails(id: string) {
    return this.employeeModel.findOne({
      where: { id },
      include: [Address, Passport],
    });
  }

  async createEmployee(employeeData: any, passportData: any, addressData: any) {
    const transaction = await this.sequelize.transaction();

    try {
      const passport = await Passport.create(passportData, { transaction });

      const address = await Address.create(addressData, { transaction });

      const employee = await Employee.create(
        {
          ...employeeData,
          passport_id: passport.id,
          address_id: address.id,
        },
        { transaction },
      );

      await transaction.commit();

      console.log('Employee created with ID:', employee.id);
    } catch (error) {
      await transaction.rollback();
      console.error('Error during transaction:', error);
    }
  }

  async findOne(id: number): Promise<Employee | null> {
    return this.employeeModel.findByPk(id, { include: { all: true } });
  }

  async update(id: string, updateData: UpdateEmployeeDto) {
    const employee = await this.employeeModel.findOne({
      where: { id },
      include: [Passport, Address],
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    Object.assign(employee, updateData);

    if (updateData.passport && employee.passport) {
      await Passport.update(updateData.passport, {
        where: { id: employee.passport_id },
      });
    }

    if (updateData.address && employee.address) {
      await Address.update(updateData.address, {
        where: { id: employee.address_id },
      });
    }

    await employee.save();
    return employee;
  }

  async softDeleteEmployee(id: number) {
    try {
      const employee = await this.employeeModel.findOne({ where: { id } });

      if (!employee) {
        throw new Error('Employee not found');
      }

      employee.deleted_at = new Date();
      await employee.save();

      if (employee.passport) {
        employee.passport.deleted_at = new Date();
        await employee.passport.save();
      }

      if (employee.address) {
        employee.address.deleted_at = new Date();
        await employee.address.save();
      }

      return employee;
    } catch (error) {
      throw new Error(`Error soft-deleting employee: ${error.message}`);
    }
  }
}
