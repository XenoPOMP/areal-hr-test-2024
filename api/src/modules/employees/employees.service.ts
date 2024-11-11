import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  // Получение всех сотрудников
  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find();
  }

  // Создание нового сотрудника
  async create(empData: Partial<Employee>): Promise<Employee> {
    console.log('Creating new employee with data:', empData);
    const employee = this.employeeRepository.create({
      name: empData.name,
      surname: empData.surname,
      second_name: empData.second_name,
      date_birth: empData.date_birth,
    });
    return this.employeeRepository.save(employee);
  }

  // Обновление сотрудника по ID
  async update(id: number, empData: Partial<Employee>): Promise<Employee> {
    console.log(`Updating employee with ID ${id}`, empData); // Лог перед обновлением
    await this.employeeRepository.update(id, empData);
    const updatedEmployee = await this.employeeRepository.findOne({ where: { id } });
    if (!updatedEmployee) {
      console.error(`Employee with ID ${id} not found`);
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    console.log(`Employee updated successfully`, updatedEmployee); // Лог после обновления
    return updatedEmployee;
  }

  // Удаление сотрудника по ID
  async remove(id: number): Promise<void> {
    console.log(`Deleting employee with ID ${id}`); // Лог перед удалением
    const deleteResult = await this.employeeRepository.delete(id);
    if (!deleteResult.affected) {
      console.error(`Employee with ID ${id} not found`);
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    console.log(`Employee deleted successfully`); // Лог после успешного удаления
  }
}