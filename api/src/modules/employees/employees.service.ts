import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Employee } from '@models/employee.model';
import { Address } from '@models/address.model';
import { Passport } from '@models/passport.model';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Sequelize } from 'sequelize-typescript';
import { File } from '@models/file.model';
import { HistoryOfChangesService } from '../history_of_changes/history_of_changes.service';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee) private employeeModel: typeof Employee,
    @InjectModel(Passport) private passportModel: typeof Passport,
    @InjectModel(Address) private addressModel: typeof Address,
    private sequelize: Sequelize,
    private historyOfChangesService: HistoryOfChangesService,
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

  async getEmployeeFiles(employeeId: number) {
    const employee = await this.employeeModel.findOne({
      where: { id: employeeId },
      include: [{ model: File, as: 'files' }],
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }

    return employee.files;
  }

  async createEmployee(
    employeeData: any,
    passportData: any,
    addressData: any,
    userId: number,
  ) {
    const transaction = await this.sequelize.transaction();

    try {
      // Создание паспорта и адреса
      const passport = passportData
        ? await Passport.create(passportData, { transaction })
        : null;
      const address = addressData
        ? await Address.create(addressData, { transaction })
        : null;

      if (!passport || !address) {
        throw new Error('Failed to create passport or address');
      }

      // Создание сотрудника
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

      // Логирование изменений только здесь, с единообразным наименованием объекта
      await this.historyOfChangesService.logChange(
        'employee', // используем 'employee' с маленькой буквы
        employee,
        userId,
      );

      return employee;
    } catch (error) {
      await transaction.rollback();
      console.error('Error during transaction:', error);
      throw new Error(`Error during employee creation: ${error.message}`);
    }
  }

  async findOne(id: number): Promise<Employee | null> {
    return this.employeeModel.findByPk(id, { include: { all: true } });
  }

  async update(id: string, updateData: UpdateEmployeeDto, userId: number) {
    const employee = await this.employeeModel.findOne({
      where: { id },
      include: [Passport, Address],
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    // Обновляем данные сотрудника
    Object.assign(employee, updateData);

    // Обновляем паспорт, если передан
    if (updateData.passport && employee.passport) {
      await Passport.update(updateData.passport, {
        where: { id: employee.passport_id },
      });
    }

    // Обновляем адрес, если передан
    if (updateData.address && employee.address) {
      await Address.update(updateData.address, {
        where: { id: employee.address_id },
      });
    }

    await employee.save();

    // Передаём только изменённые данные в логирование
    await this.historyOfChangesService.logChange(
      'employee'.toLowerCase(),
      updateData, // Только изменения
      userId,
    );

    return employee;
  }

  async softDeleteEmployee(id: number, userId: number): Promise<Employee> {
    const transaction = await this.sequelize.transaction();
    try {
      const employee = await this.employeeModel.findOne({
        where: { id },
        include: [
          { model: Passport, required: false },
          { model: Address, required: false },
        ],
        transaction,
      });

      if (!employee) {
        throw new Error('Employee not found');
      }

      if (employee.passport) {
        await employee.passport.update(
          { deleted_at: new Date() },
          { transaction },
        );
      }

      if (employee.address) {
        await employee.address.update(
          { deleted_at: new Date() },
          { transaction },
        );
      }

      await employee.destroy({ transaction });

      await this.historyOfChangesService.logChange(
        'employee',
        {
          id: employee.id,
          passport_id: employee.passport_id,
          address_id: employee.address_id,
          deleted_at: new Date(),
        },
        userId,
      );

      await transaction.commit();
      return employee;
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Error soft-deleting employee: ${error.message}`);
    }
  }
}
