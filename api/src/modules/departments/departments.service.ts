import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './department.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  // Получение всех организаций
  async findAll(): Promise<Department[]> {
    return this.departmentRepository.find();
  }

  // Создание новой организации
  async create(orgData: Partial<Department>): Promise<Department> {
    console.log('Creating new organization with data:', orgData);
    const department = this.departmentRepository.create({
      name: orgData.name,
      comment: orgData.comment,
    });
    return this.departmentRepository.save(department);
  }

  // Обновление организации по ID
  async update(id: number, depData: Partial<Department>): Promise<Department> {
    console.log(`Updating department with ID ${id}`, depData); // Лог перед обновлением
    await this.departmentRepository.update(id, depData);
    const updatedDepartment = await this.departmentRepository.findOne({
      where: { id },
    });
    if (!updatedDepartment) {
      console.error(`Department with ID ${id} not found`);
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    console.log(`Department updated successfully`, updatedDepartment); // Лог после обновления
    return updatedDepartment;
  }

  // Удаление организации по ID
  async remove(id: number): Promise<void> {
    console.log(`Deleting department with ID ${id}`); // Лог перед удалением
    const deleteResult = await this.departmentRepository.delete(id);
    if (!deleteResult.affected) {
      console.error(`Department with ID ${id} not found`);
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    console.log(`Department deleted successfully`); // Лог после успешного удаления
  }
}
