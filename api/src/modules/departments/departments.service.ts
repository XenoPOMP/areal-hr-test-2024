import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  private departments = []; // Временное хранилище для департаментов

  findAll() {
    return this.departments;
  }

  findOne(id: string) {
    return this.departments.find(dep => dep.id === id);
  }

  create(createDepartmentDto: CreateDepartmentDto) {
    const newDep = { id: Date.now().toString(), ...createDepartmentDto };
    this.departments.push(newDep);
    return newDep;
  }

  update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    const depIndex = this.departments.findIndex(dep => dep.id === id);
    if (depIndex === -1) return null;
    this.departments[depIndex] = { ...this.departments[depIndex], ...updateDepartmentDto };
    return this.departments[depIndex];
  }

  remove(id: string) {
    const depIndex = this.departments.findIndex(dep => dep.id === id);
    if (depIndex === -1) return null;
    const removedDep = this.departments.splice(depIndex, 1);
    return removedDep[0];
  }
}