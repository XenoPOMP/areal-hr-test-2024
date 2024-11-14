import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { Passport } from '../passports/passport.entity';
import { Address } from '../addresses/address.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(Passport)
    private passportRepository: Repository<Passport>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const { passport, address, ...employeeData } = createEmployeeDto;

    const newEmployee = this.employeeRepository.create(employeeData);

    if (passport) {
      const newPassport = this.passportRepository.create(passport);
      newEmployee.passport = await this.passportRepository.save(newPassport);
    }

    if (address) {
      const newAddress = this.addressRepository.create(address);
      newEmployee.address = await this.addressRepository.save(newAddress);
    }

    return this.employeeRepository.save(newEmployee);
  }

  async update(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    const { passport, address, ...employeeData } = updateEmployeeDto;
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['passport', 'address'],
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    if (passport && employee.passport) {
      await this.passportRepository.update(employee.passport.id, passport);
    } else if (passport) {
      employee.passport = await this.passportRepository.save(passport);
    }

    if (address && employee.address) {
      await this.addressRepository.update(employee.address.id, address);
    } else if (address) {
      employee.address = await this.addressRepository.save(address);
    }

    return this.employeeRepository.save({ ...employee, ...employeeData });
  }

  async remove(id: number): Promise<void> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['passport', 'address'],
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    if (employee.passport) {
      await this.passportRepository.delete(employee.passport.id);
    }

    if (employee.address) {
      await this.addressRepository.delete(employee.address.id);
    }

    await this.employeeRepository.delete(id);
  }
}
