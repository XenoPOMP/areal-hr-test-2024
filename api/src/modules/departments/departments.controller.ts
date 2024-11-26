import { Controller, Get, Post, Put, Patch, Param, Body } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { Department } from '@models/department.model';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  findAll(): Promise<Department[]> {
    return this.departmentsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateDepartmentDto): Promise<Department> {
    return this.departmentsService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdateDepartmentDto,
  ): Promise<Department | null> {
    return this.departmentsService.update(id, dto);
  }

  @Patch(':id/soft-delete')
  async softDeleteDepartment(@Param('id') id: number) {
    await this.departmentsService.softDeleteDepartment(id);
    return;
  }
}
